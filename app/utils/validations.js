const Joi = require('joi');

// Auth Register Input Validation Schema
const AuthVAlSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(50)
    .required()
    .messages({
      'string.base': 'Name must be a string.',
      'string.min': 'Name must have at least 3 characters.',
      'string.max': 'Name can have at most 50 characters.',
      'any.required': 'Name is required.',
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Email must be a valid email address.',
      'any.required': 'Email is required.',
    }),
  password: Joi.string()
    .min(8)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long.',
      'any.required': 'Password is required.',
    }),
  phone_number: Joi.string()
    .pattern(/^[0-9]+$/)
    .min(8)
    .max(15)
    .required()
    .messages({
      'string.pattern.base': 'Phone number must contain only digits.',
      'string.min': 'Phone number must have at least 8 digits.',
      'string.max': 'Phone number can have at most 15 digits.',
      'any.required': 'Phone number is required.',
    }),
  birthdate: Joi.date()
    .iso()
    .allow(null)
    .optional()
    .messages({
      'date.base': 'Birthdate must be a valid ISO date.',
    }),
  gender: Joi.string()
    .valid('male', 'female')
    .allow(null)
    .optional()
    .messages({
      'any.only': 'Gender must be either "Male" or "Female".',
    }),
  role: Joi.string()
    .valid('Admin', 'Organizer', 'Operator', 'User')
    .required()
    .messages({
      'any.only': 'Role must be one of Admin, Organizer, Operator, or User.',
      'any.required': 'Role is required.',
    }),
});

// Login Input Validation Schema
const LoginVAlSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Email must be a valid email address.',
      'any.required': 'Email is required.',
    }),
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Password is required.',
    }),
});

// Validation schema for creating a user
const CreateUserValidationSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(50)
    .required()
    .messages({
      'string.base': 'Name must be a string.',
      'string.min': 'Name must have at least 3 characters.',
      'string.max': 'Name can have at most 50 characters.',
      'any.required': 'Name is required.',
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Email must be a valid email address.',
      'any.required': 'Email is required.',
    }),
  password: Joi.string()
    .min(8)
    .optional()
    .messages({
      'string.min': 'Password must be at least 8 characters long.',
      'any.required': 'Password is required.',
    }),
  phone_number: Joi.string()
    .pattern(/^[0-9]+$/)
    .min(8)
    .max(15)
    .required()
    .messages({
      'string.pattern.base': 'Phone number must contain only digits.',
      'string.min': 'Phone number must have at least 8 digits.',
      'string.max': 'Phone number can have at most 15 digits.',
      'any.required': 'Phone number is required.',
    }),
  birthdate: Joi.date()
    .iso()
    .allow(null)
    .optional()
    .messages({
      'date.base': 'Birthdate must be a valid ISO date.',
    }),
  gender: Joi.string()
    .valid('male', 'female')
    .allow(null)
    .optional()
    .messages({
      'any.only': 'Gender must be either "Male" or "Female".',
    }),
  role: Joi.string()
    .valid('Admin', 'Organizer', 'Operator', 'User')
    .required()
    .messages({
      'any.only': 'Role must be one of Admin, Organizer, Operator, or User.',
      'any.required': 'Role is required.',
    }),
});

//Notifcation Validation schema
const notificationValidationSchema = Joi.object({
  mailing_id: Joi.number().integer().optional().messages({
    'number.base': 'mailing_id must be an integer',
  }),
  message: Joi.string().min(3).required().messages({
    'string.base': 'message must be a string',
    'any.required': 'message is required',
    'string.min': 'message must have at least 3 characters',
  }),
  is_read: Joi.boolean().optional().messages({
    'boolean.base': 'is_read must be a boolean',
  }),
  date_time: Joi.date().optional().messages({
    'date.base': 'date_time must be a valid date',
  }),
});

// Input Validation permission schema
const addPermissionSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(50)
    .required()
    .messages({
      'string.base': 'Permission name must be a string.',
      'string.min': 'Permission name must have at least 3 characters.',
      'string.max': 'Permission name can have at most 50 characters.',
      'any.required': 'Permission name is required.',
    }),
});

// Input Validation Assign permission schema
const assignPermissionSchema = Joi.object({
  permissionIds: Joi.array()
    .items(Joi.number().integer().positive())
    .min(1)
    .required()
    .messages({
      'array.base': 'Permission IDs must be an array of integers.',
      'array.min': 'You must provide at least one permission ID.',
      'number.base': 'Each permission ID must be a positive integer.',
      'any.required': 'Permission IDs are required.',
    }),
});

// Input Validation Remove permission schema
const removePermissionSchema = Joi.object({
  permissionIds: Joi.array()
    .items(Joi.number().integer().positive())
    .min(1)
    .required()
    .messages({
      'array.base': 'Permission IDs must be an array of integers.',
      'array.min': 'You must provide at least one permission ID.',
      'number.base': 'Each permission ID must be a positive integer.',
      'any.required': 'Permission IDs are required.',
    }),
});

// Input Validation Add Hobby schema
const addHobbySchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(50)
    .required()
    .messages({
      'string.base': 'Hobby name must be a string.',
      'string.min': 'Hobby name must have at least 3 characters.',
      'string.max': 'Hobby name can have at most 50 characters.',
      'any.required': 'Hobby name is required.',
    }),
});

// Input Validation Assign Hobby schema
const assignHobbySchema = Joi.object({
  hobbyIds: Joi.array()
    .items(Joi.number().integer().positive())
    .min(1)
    .required()
    .messages({
      'array.base': 'Hobby IDs must be an array of integers.',
      'array.min': 'You must provide at least one hobby ID.',
      'number.base': 'Each hobby ID must be a positive integer.',
      'any.required': 'Hobby IDs are required.',
    }),
});

// Input Validation Remove Hobby schema
const removeHobbySchema = Joi.object({
  hobbyIds: Joi.array()
    .items(Joi.number().integer().positive())
    .min(1)
    .required()
    .messages({
      'array.base': 'Hobby IDs must be an array of integers.',
      'array.min': 'You must provide at least one hobby ID.',
      'number.base': 'Each hobby ID must be a positive integer.',
      'any.required': 'Hobby IDs are required.',
    }),
});

// Input Validation Create Category schema
const createCategorySchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.base': 'Category name must be a string.',
      'string.empty': 'Category name is required.',
      'string.min': 'Category name must have at least 3 characters.',
      'string.max': 'Category name cannot exceed 100 characters.',
      'any.required': 'Category name is required.',
    }),
  description: Joi.string()
    .trim()
    .max(255)
    .allow(null, '')
    .messages({
      'string.base': 'Description must be a string.',
      'string.max': 'Description cannot exceed 255 characters.',
    }),
  type: Joi.string()
    .valid('product', 'event', 'blog')
    .required()
    .messages({
      'any.only': 'Type must be one of "product", "event", or "blog".',
      'any.required': 'Type is required.',
    }),
});

// Input Validation Create Coupon schema
const createCouponSchema = Joi.object({
  user_id: Joi.number().integer().required().messages({
    "number.base": "User ID must be an integer.",
    "any.required": "User ID is required.",
  }),
  coupon_key: Joi.string().min(5).required().messages({
    "string.base": "Coupon key must be a string.",
    "string.min": "Coupon key must have at least 5 characters.",
    "any.required": "Coupon key is required.",
  }),
  discount_percentage: Joi.number().min(0).max(100).allow(null).messages({
    "number.base": "Discount percentage must be a number.",
    "number.min": "Discount percentage cannot be less than 0.",
    "number.max": "Discount percentage cannot exceed 100.",
  }),
  discount_in_dollar: Joi.number().min(0).allow(null).messages({
    "number.base": "Discount in dollar must be a number.",
    "number.min": "Discount in dollar cannot be negative.",
  }),
  min_price: Joi.number().min(0).required().messages({
    "number.base": "Minimum price must be a number.",
    "number.min": "Minimum price cannot be negative.",
    "any.required": "Minimum price is required.",
  }),
  max_uses: Joi.number().integer().min(1).required().messages({
    "number.base": "Maximum uses must be an integer.",
    "number.min": "Maximum uses must be at least 1.",
    "any.required": "Maximum uses is required.",
  }),
  allowed_uses_per_user:Joi.number().integer().min(1).required().messages({
    "number.base": "Allowed uses for a single user must be an integer.",
    "number.min": "Allowed uses for a single user  must be at least 1.",
    "any.required": "Allowed uses for a single user is required.",
  }),
  valid_from: Joi.date().required().messages({
    "date.base": "Valid from must be a valid date.",
    "any.required": "Valid from is required.",
  }),
  valid_to: Joi.date().required().greater(Joi.ref("valid_from")).messages({
    "date.base": "Valid to must be a valid date.",
    "date.greater": "Valid to must be after valid from.",
    "any.required": "Valid to is required.",
  }),
}).custom((value, helpers) => {
  const { discount_percentage, discount_in_dollar } = value;

  if (discount_percentage === null && discount_in_dollar === null) {
    return helpers.error(
      "any.custom",
      "At least one of discount_percentage or discount_in_dollar must be provided."
    );
  }
  return value;
});

// Input Validation Apply Coupon schema
const applyCouponSchema = Joi.object({
  coupon_key: Joi.string().min(5).required().messages({
    "string.base": "Coupon key must be a string.",
    "string.min": "Coupon key must have at least 5 characters.",
    "any.required": "Coupon key is required.",
  }),
  total_price: Joi.number().min(0).required().messages({
    "number.base": "Total price must be a number.",
    "number.min": "Total price cannot be negative.",
    "any.required": "Total price is required.",
  }),
  user_id: Joi.number().integer().required().messages({
    "number.base": "User ID must be an integer.",
    "any.required": "User ID is required.",
  }),
});

// Input Validation Create Blog schema
const createBlogSchema = Joi.object({
  user_id: Joi.number().integer().required().messages({
    "number.base": "User ID must be a number.",
    "any.required": "User ID is required.",
  }),
  event_id: Joi.number().integer().optional().messages({
    "number.base": "Event ID must be a number.",
    "any.required": "Event ID is required.",
  }),
  title: Joi.string().min(3).max(255).required().messages({
    "string.base": "Title must be a string.",
    "string.min": "Title must have at least 3 characters.",
    "string.max": "Title must not exceed 255 characters.",
    "any.required": "Title is required.",
  }),
  content: Joi.string().min(10).required().messages({
    "string.base": "Content must be a string.",
    "string.min": "Content must have at least 10 characters.",
    "any.required": "Content is required.",
  }),
  tags: Joi.alternatives()
  .try(
    Joi.array().items(Joi.string().min(1).max(50)),
    Joi.string().custom((value, helpers) => {
      try {
        const parsed = JSON.parse(value);
        if (!Array.isArray(parsed)) {
          throw new Error();
        }
        parsed.forEach((tag) => {
          if (typeof tag !== "string" || tag.length < 1 || tag.length > 50) {
            throw new Error();
          }
        });
        return parsed; // Return parsed value for further processing
      } catch {
        return helpers.error("array.base");
      }
    })
  )
  .optional()
  .messages({
    "array.base": "Tags must be an array of strings.",
  }),
  description: Joi.string().max(500).optional().messages({
    "string.base": "Description must be a string.",
    "string.max": "Description must not exceed 500 characters.",
  }),
});

// Input validation schema for setting password
const setPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(8).required(),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
});

// Validation schema for creating a product
const createProductSchema = Joi.object({
  user_id: Joi.number().integer().required().messages({
    "number.base": "User ID must be a number.",
    "any.required": "User ID is required.",
  }),
  name: Joi.string().min(3).max(100).required().messages({
    "string.base": "Name must be a string.",
    "string.min": "Name must be at least 3 characters long.",
    "string.max": "Name cannot exceed 100 characters.",
    "any.required": "Name is required.",
  }),
  description: Joi.string().allow(null, "").max(255).messages({
    "string.base": "Description must be a string.",
    "string.max": "Description cannot exceed 255 characters.",
  }),
  image: Joi.string().uri().allow(null, "").messages({
    "string.uri": "Image must be a valid URL.",
  }),
});

  module.exports = {
    AuthVAlSchema,
    LoginVAlSchema,
    CreateUserValidationSchema,
    setPasswordSchema,
    notificationValidationSchema,
    addPermissionSchema,
    assignPermissionSchema,
    removePermissionSchema,
    addHobbySchema,
    assignHobbySchema,
    removeHobbySchema,
    createCategorySchema,
    createCouponSchema,
    applyCouponSchema,
    createBlogSchema,
    createProductSchema
};