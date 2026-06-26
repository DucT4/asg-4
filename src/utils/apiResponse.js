const buildResponse = ({ success, message, data = null, errors = null }) => {
  const response = {
    success,
    message,
    timestamp: new Date().toISOString()
  };

  if (data !== null && data !== undefined) {
    response.data = data;
  }

  if (errors !== null && errors !== undefined) {
    response.errors = errors;
  }

  return response;
};

const success = (res, { statusCode = 200, message = 'Success', data = null } = {}) => {
  return res.status(statusCode).json(
    buildResponse({
      success: true,
      message,
      data
    })
  );
};

const created = (res, { message = 'Created successfully', data = null } = {}) => {
  return success(res, {
    statusCode: 201,
    message,
    data
  });
};

const fail = (res, { statusCode = 400, message = 'Bad request', errors = null, data = null } = {}) => {
  return res.status(statusCode).json(
    buildResponse({
      success: false,
      message,
      data,
      errors
    })
  );
};

module.exports = {
  success,
  created,
  fail
};
