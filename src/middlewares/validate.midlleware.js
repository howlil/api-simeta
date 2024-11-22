// src/middlewares/validate.middleware.js
const validate = async (schema, data) => {
  try {
    const validatedData = await schema.validate(data, { abortEarly: false });
    
    return {
      error: false,
      data: validatedData
    };
  } catch (error) {
    const errorMessages = [];
    for (const err of error.errors) {
      errorMessages.push(err);
    }
    return {
      error: true,
      messages: errorMessages
    };
  }
};

module.exports = validate;
