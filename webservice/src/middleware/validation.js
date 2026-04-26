const Joi = require('joi');

const spoolSchema = Joi.object({
  uuid: Joi.string().uuid().optional(),
  user_id: Joi.number().integer().positive().optional(),
  nfc_uid: Joi.string().max(50).optional().allow(null),
  manufacturer: Joi.string().required(),
  brand: Joi.string().optional().allow(null),
  material: Joi.string().required(),
  color: Joi.string().required(),
  diameter: Joi.number().positive().default(1.75),
  initial_weight: Joi.number().positive().required(),
  current_weight: Joi.number().min(0).optional(),
  price: Joi.number().min(0).optional().allow(null),
  purchase_date: Joi.date().optional().allow(null),
  lot_number: Joi.string().optional().allow(null),
  notes: Joi.string().optional().allow(null)
});

const validateSpool = (req, res, next) => {
  const { error } = spoolSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      details: error.details.map(d => d.message)
    });
  }
  
  next();
};

module.exports = {
  validateSpool
};
