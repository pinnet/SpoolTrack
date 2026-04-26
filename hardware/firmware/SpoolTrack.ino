/*
 * SpoolTrack ESP32 Firmware
 * 
 * NFC-based filament spool tracking system
 * 
 * Hardware:
 * - ESP32 (ESP32-WROOM-32 or similar)
 * - PN532 NFC/RFID Module (I2C)
 * - OLED Display 128x64 (I2C, SSD1306 or SH1106)
 * 
 * Features:
 * - Scan NFC tags to read spool information
 * - Display spool details on OLED
 * - Sync data with SpoolTrack web service
 * - Offline caching
 * - OTA updates
 * 
 * Author: SpoolTrack Contributors
 * License: MIT
 * Version: 1.0.0
 */

#include <Wire.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <Preferences.h>

// Display libraries
#ifdef USE_SSD1306
  #include <Adafruit_SSD1306.h>
#endif
#ifdef USE_SH1106
  #include <Adafruit_SH1106.h>
#endif
#include <Adafruit_GFX.h>

// NFC library
#include <Adafruit_PN532.h>

// OTA updates
#if ENABLE_OTA
  #include <ArduinoOTA.h>
#endif

// Configuration
#include "config.h"

// ============================================
// Global Objects
// ============================================
#ifdef USE_SSD1306
  Adafruit_SSD1306 display(OLED_WIDTH, OLED_HEIGHT, &Wire, OLED_RESET);
#endif
#ifdef USE_SH1106
  Adafruit_SH1106 display(OLED_WIDTH, OLED_HEIGHT, &Wire, OLED_RESET);
#endif

Adafruit_PN532 nfc(PN532_I2C, Wire);
Preferences preferences;
HTTPClient http;

// ============================================
// Global Variables
// ============================================
unsigned long lastUpdateTime = 0;
unsigned long lastScanTime = 0;
unsigned long screenTimeout = 0;
bool screenActive = true;
bool wifiConnected = false;
bool serverConnected = false;

String lastScannedUID = "";
String currentSpoolData = "";

// Display modes
enum DisplayMode {
  MODE_IDLE,
  MODE_SPOOL_INFO,
  MODE_SYSTEM_STATUS,
  MODE_ERROR
};
DisplayMode currentMode = MODE_IDLE;

// ============================================
// Function Prototypes
// ============================================
void setupWiFi();
void setupDisplay();
void setupNFC();
void setupOTA();
void checkWiFi();
void scanNFC();
void displayIdleScreen();
void displaySpoolInfo(JsonDocument& doc);
void displaySystemStatus();
void displayError(String message);
void sendToServer(String uid, String data);
bool fetchSpoolData(String uid);
void saveToCache(String uid, String data);
String loadFromCache(String uid);
void handleButtons();

// ============================================
// Setup
// ============================================
void setup() {
  Serial.begin(SERIAL_BAUD);
  delay(1000);
  
  DEBUG_PRINTLN("\n\n========================================");
  DEBUG_PRINTLN("SpoolTrack ESP32 Firmware");
  DEBUG_PRINTF("Version: %s\n", FIRMWARE_VERSION);
  DEBUG_PRINTLN("========================================\n");

  // Initialize I2C
  Wire.begin(I2C_SDA, I2C_SCL);
  Wire.setClock(I2C_FREQ);
  
  // Initialize preferences
  preferences.begin("spooltrack", false);
  
  // Setup hardware
  setupDisplay();
  setupNFC();
  setupWiFi();
  
  #if ENABLE_OTA
    setupOTA();
  #endif
  
  // Setup buttons if enabled
  #if ENABLE_BUTTONS
    pinMode(BTN_SELECT, INPUT_PULLUP);
    pinMode(BTN_PREV, INPUT_PULLUP);
    pinMode(BTN_NEXT, INPUT_PULLUP);
  #endif
  
  // Setup LED
  #if ENABLE_LED
    pinMode(LED_PIN, OUTPUT);
    digitalWrite(LED_PIN, LOW);
  #endif
  
  DEBUG_PRINTLN("Setup complete!\n");
  displayIdleScreen();
}

// ============================================
// Main Loop
// ============================================
void loop() {
  // Handle OTA updates
  #if ENABLE_OTA
    ArduinoOTA.handle();
  #endif
  
  // Check WiFi connection
  checkWiFi();
  
  // Handle button input
  #if ENABLE_BUTTONS
    handleButtons();
  #endif
  
  // Scan for NFC tags
  if (millis() - lastScanTime > 500) {
    scanNFC();
    lastScanTime = millis();
  }
  
  // Screen timeout
  if (SCREEN_TIMEOUT > 0 && screenActive && 
      millis() - screenTimeout > SCREEN_TIMEOUT) {
    display.clearDisplay();
    display.display();
    screenActive = false;
    DEBUG_PRINTLN("Screen timeout");
  }
  
  delay(TASK_DELAY_MS);
}

// ============================================
// Setup Functions
// ============================================
void setupWiFi() {
  DEBUG_PRINT("Connecting to WiFi: ");
  DEBUG_PRINTLN(WIFI_SSID);
  
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(0, 0);
  display.println("SpoolTrack");
  display.println();
  display.println("Connecting WiFi...");
  display.display();
  
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  
  unsigned long startTime = millis();
  while (WiFi.status() != WL_CONNECTED && 
         millis() - startTime < WIFI_TIMEOUT_MS) {
    delay(500);
    DEBUG_PRINT(".");
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    wifiConnected = true;
    DEBUG_PRINTLN("\nWiFi connected!");
    DEBUG_PRINT("IP address: ");
    DEBUG_PRINTLN(WiFi.localIP());
    
    // Blink LED to indicate connection
    #if ENABLE_LED
      for (int i = 0; i < 3; i++) {
        digitalWrite(LED_PIN, HIGH);
        delay(100);
        digitalWrite(LED_PIN, LOW);
        delay(100);
      }
    #endif
  } else {
    wifiConnected = false;
    DEBUG_PRINTLN("\nWiFi connection failed!");
    displayError("WiFi Failed");
    delay(2000);
  }
}

void setupDisplay() {
  DEBUG_PRINTLN("Initializing display...");
  
  #ifdef USE_SSD1306
    if (!display.begin(SSD1306_SWITCHCAPVCC, OLED_ADDRESS)) {
      DEBUG_PRINTLN("SSD1306 allocation failed!");
      while (1);
    }
  #endif
  
  #ifdef USE_SH1106
    if (!display.begin(OLED_ADDRESS)) {
      DEBUG_PRINTLN("SH1106 allocation failed!");
      while (1);
    }
  #endif
  
  display.clearDisplay();
  display.setTextSize(2);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(0, 20);
  display.println("SpoolTrack");
  display.setTextSize(1);
  display.println();
  display.printf("v%s", FIRMWARE_VERSION);
  display.display();
  delay(2000);
  
  DEBUG_PRINTLN("Display initialized");
}

void setupNFC() {
  DEBUG_PRINTLN("Initializing NFC reader...");
  
  display.clearDisplay();
  display.setTextSize(1);
  display.setCursor(0, 0);
  display.println("Initializing NFC...");
  display.display();
  
  nfc.begin();
  
  uint32_t versiondata = nfc.getFirmwareVersion();
  if (!versiondata) {
    DEBUG_PRINTLN("PN532 not found!");
    displayError("NFC Not Found");
    while (1);
  }
  
  DEBUG_PRINT("Found PN532 chip, version: ");
  DEBUG_PRINTLN((versiondata >> 24) & 0xFF, HEX);
  
  nfc.SAMConfig();
  DEBUG_PRINTLN("NFC reader initialized");
}

void setupOTA() {
  DEBUG_PRINTLN("Setting up OTA...");
  
  ArduinoOTA.setHostname(OTA_HOSTNAME);
  ArduinoOTA.setPassword(OTA_PASSWORD);
  
  ArduinoOTA.onStart([]() {
    String type = (ArduinoOTA.getCommand() == U_FLASH) ? "sketch" : "filesystem";
    DEBUG_PRINTLN("Start updating " + type);
    display.clearDisplay();
    display.setTextSize(1);
    display.setCursor(0, 0);
    display.println("OTA Update");
    display.display();
  });
  
  ArduinoOTA.onEnd([]() {
    DEBUG_PRINTLN("\nOTA complete");
  });
  
  ArduinoOTA.onProgress([](unsigned int progress, unsigned int total) {
    int percent = (progress / (total / 100));
    DEBUG_PRINTF("Progress: %u%%\r", percent);
  });
  
  ArduinoOTA.onError([](ota_error_t error) {
    DEBUG_PRINTF("Error[%u]: ", error);
    if (error == OTA_AUTH_ERROR) DEBUG_PRINTLN("Auth Failed");
    else if (error == OTA_BEGIN_ERROR) DEBUG_PRINTLN("Begin Failed");
    else if (error == OTA_CONNECT_ERROR) DEBUG_PRINTLN("Connect Failed");
    else if (error == OTA_RECEIVE_ERROR) DEBUG_PRINTLN("Receive Failed");
    else if (error == OTA_END_ERROR) DEBUG_PRINTLN("End Failed");
  });
  
  ArduinoOTA.begin();
  DEBUG_PRINTLN("OTA ready");
}

// ============================================
// Runtime Functions
// ============================================
void checkWiFi() {
  if (WiFi.status() != WL_CONNECTED && wifiConnected) {
    wifiConnected = false;
    DEBUG_PRINTLN("WiFi disconnected!");
    
    // Try to reconnect
    WiFi.disconnect();
    WiFi.reconnect();
  } else if (WiFi.status() == WL_CONNECTED && !wifiConnected) {
    wifiConnected = true;
    DEBUG_PRINTLN("WiFi reconnected!");
  }
}

void scanNFC() {
  uint8_t uid[] = { 0, 0, 0, 0, 0, 0, 0 };
  uint8_t uidLength;
  
  bool success = nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, uid, &uidLength, NFC_TIMEOUT);
  
  if (success) {
    // Convert UID to string
    String uidString = "";
    for (uint8_t i = 0; i < uidLength; i++) {
      if (uid[i] < 0x10) uidString += "0";
      uidString += String(uid[i], HEX);
    }
    uidString.toUpperCase();
    
    // Only process if it's a new scan
    if (uidString != lastScannedUID || millis() - lastScanTime > 5000) {
      lastScannedUID = uidString;
      DEBUG_PRINT("NFC Tag detected: ");
      DEBUG_PRINTLN(uidString);
      
      #if ENABLE_LED
        digitalWrite(LED_PIN, HIGH);
      #endif
      
      // Fetch spool data
      bool dataFetched = fetchSpoolData(uidString);
      
      if (dataFetched && currentSpoolData.length() > 0) {
        // Parse and display
        StaticJsonDocument<MAX_JSON_SIZE> doc;
        DeserializationError error = deserializeJson(doc, currentSpoolData);
        
        if (!error) {
          currentMode = MODE_SPOOL_INFO;
          displaySpoolInfo(doc);
          screenTimeout = millis();
          screenActive = true;
        }
      }
      
      #if ENABLE_LED
        digitalWrite(LED_PIN, LOW);
      #endif
    }
  }
}

bool fetchSpoolData(String uid) {
  if (!wifiConnected) {
    DEBUG_PRINTLN("No WiFi, checking cache...");
    currentSpoolData = loadFromCache(uid);
    return currentSpoolData.length() > 0;
  }
  
  String url = String(SERVER_URL) + "/nfc/read";
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  if (strlen(API_KEY) > 0) {
    http.addHeader("X-API-Key", API_KEY);
  }
  
  StaticJsonDocument<200> requestDoc;
  requestDoc["nfc_uid"] = uid;
  
  String requestBody;
  serializeJson(requestDoc, requestBody);
  
  int httpResponseCode = http.POST(requestBody);
  
  if (httpResponseCode == 200) {
    currentSpoolData = http.getString();
    saveToCache(uid, currentSpoolData);
    DEBUG_PRINTLN("Spool data fetched from server");
    http.end();
    return true;
  } else {
    DEBUG_PRINT("HTTP error: ");
    DEBUG_PRINTLN(httpResponseCode);
    
    // Try cache
    currentSpoolData = loadFromCache(uid);
    http.end();
    return currentSpoolData.length() > 0;
  }
}

void saveToCache(String uid, String data) {
  String key = "spool_" + uid;
  preferences.putString(key.c_str(), data);
  DEBUG_PRINTLN("Saved to cache: " + uid);
}

String loadFromCache(String uid) {
  String key = "spool_" + uid;
  String data = preferences.getString(key.c_str(), "");
  if (data.length() > 0) {
    DEBUG_PRINTLN("Loaded from cache: " + uid);
  }
  return data;
}

// ============================================
// Display Functions
// ============================================
void displayIdleScreen() {
  display.clearDisplay();
  display.setTextSize(2);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(10, 10);
  display.println("Scan Tag");
  
  display.setTextSize(1);
  display.setCursor(0, 40);
  if (wifiConnected) {
    display.print("WiFi: ");
    display.println(WiFi.localIP());
  } else {
    display.println("WiFi: Offline");
  }
  
  display.display();
}

void displaySpoolInfo(JsonDocument& doc) {
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  
  // Parse data
  JsonObject data = doc["data"];
  String material = data["material"] | "Unknown";
  String color = data["color"] | "Unknown";
  String manufacturer = data["manufacturer"] | "Unknown";
  float currentWeight = data["current_weight"] | 0.0;
  float initialWeight = data["initial_weight"] | 1000.0;
  
  float percentRemaining = (currentWeight / initialWeight) * 100.0;
  
  // Display information
  display.setCursor(0, 0);
  display.setTextSize(1);
  display.println(manufacturer);
  
  display.setTextSize(2);
  display.println(material);
  
  display.setTextSize(1);
  display.println(color);
  
  display.println();
  display.printf("Weight: %.0fg\n", currentWeight);
  display.printf("Remaining: %.0f%%\n", percentRemaining);
  
  display.display();
}

void displaySystemStatus() {
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(0, 0);
  
  display.println("System Status");
  display.println("==============");
  display.printf("WiFi: %s\n", wifiConnected ? "OK" : "Fail");
  display.printf("IP: %s\n", WiFi.localIP().toString().c_str());
  display.printf("Uptime: %lus\n", millis() / 1000);
  display.printf("Free Heap: %d\n", ESP.getFreeHeap());
  
  display.display();
}

void displayError(String message) {
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(0, 20);
  display.println("ERROR:");
  display.println(message);
  display.display();
}

void handleButtons() {
  #if ENABLE_BUTTONS
    if (digitalRead(BTN_SELECT) == LOW) {
      delay(200);  // Debounce
      currentMode = (DisplayMode)((currentMode + 1) % 4);
      switch (currentMode) {
        case MODE_IDLE:
          displayIdleScreen();
          break;
        case MODE_SYSTEM_STATUS:
          displaySystemStatus();
          break;
        default:
          break;
      }
      screenTimeout = millis();
      screenActive = true;
    }
  #endif
}
