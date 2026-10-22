// Sequelize Validator Error
export const sequelizeValidationError = (errors) => {
    const err = new Error("Validation failed");
    err.status = 400;
    err.errors = errors.reduce((acc, err) => {
        if(acc[err.path]) acc[err.path].push(err.message);
        else acc[err.path] = [err.message]
        return acc;
    }, {})

    return err
}

// Missing Required Field
export const missingFieldError = (missingFields) => {
    const err = new Error("Missing required fields");
    err.status = 400;
    err.errors = missingFields.map(field => ({ [field.toLowerCase()]: `${field} is required`}))

    return err;
}

// Non Sequelize Validator Error
export const validationError = (errors) => {
    const err = new Error("Validation failed");
    err.status = 400;
    err.errors = errors;

    return err;
}

// Generic Error
export const genericError = (message = "Internal Server Error") => {
    const err = new Error(message);
    err.status = 500;

    return err;
}

// 401 Unauthorized
export const unauthorizedError = (message = "Unauthorized") => {
  const err = new Error(message);
  err.status = 401;
  err.errors = { authorization: message };

  return err;
}

// 403 Forbidden
export const forbiddenError = (message = "Forbidden") => {
  const err = new Error(message);
  err.status = 403;
  err.errors = { authorization: message };

  return err;
}
