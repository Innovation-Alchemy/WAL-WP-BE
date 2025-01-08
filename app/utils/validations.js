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
    .valid('Male', 'Female')
    .allow(null)
    .optional()
    .messages({
      'any.only': 'Gender must be either "Male" or "Female".',
    }),
  role: Joi.string()
    .valid( 'Organizer', 'User') // only user and organizer can register as an admin an admin must create and as an operator the organizer creates it
    .required()
    .messages({
      'any.only': 'Role must be one of  Organizer or User.',
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

// Input Validation Schema
const addPermissionSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(50)
    .required()
    .messages({
      "string.base": "Permission name must be a string.",
      "string.min": "Permission name must have at least 3 characters.",
      "string.max": "Permission name can have at most 50 characters.",
      "any.required": "Permission name is required.",
    }),
  roles: Joi.array()
    .items(
      Joi.string().valid("Admin", "Organizer", "Operator", "User")
    )
    .min(1)
    .required()
    .messages({
      "array.base": "Roles must be an array of valid role names.",
      "array.items": "Each role must be one of: Admin, Organizer, Operator, User.",
      "array.min": "At least one role must be specified.",
      "any.required": "Roles are required.",
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
 
});

const assignCategorySchema = Joi.object({
  categoryIds: Joi.array().items(Joi.number().integer()).required(),
});

const removeCategorySchema = Joi.object({
  categoryIds: Joi.array().items(Joi.number().integer()).required(),
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

  event_id: Joi.number().integer().optional().messages({
    "number.base": "Event ID must be a number.",
  }),

  blog_id: Joi.number().integer().optional().messages({
    "number.base": "Blog ID must be a number.",
  }),

  name: Joi.string().min(3).max(100).required().messages({
    "string.base": "Name must be a string.",
    "string.min": "Name must be at least 3 characters long.",
    "string.max": "Name cannot exceed 100 characters.",
    "any.required": "Name is required.",
  }),

  description: Joi.string().allow(null).max(255).messages({
    "string.base": "Description must be a string.",
    "string.max": "Description cannot exceed 255 characters.",
  }),

  image: Joi.array()
    .items(
      Joi.object({
        color: Joi.string().min(1).required().messages({
          "string.base": "Color must be a string.",
          "string.min": "Color must be at least 1 character long.",
          "any.required": "Color is required for each image.",
        }),
        image: Joi.string().uri().required().messages({
          "string.uri": "Image must be a valid URL.",
          "any.required": "Image URL is required.",
        }),
      })
    )
    .required()
    .messages({
      "array.base": "Image must be an array of objects with color and image fields.",
      "any.required": "Image array is required.",
    }),

  price: Joi.number().min(0).required().messages({
    "number.base": "Price must be a number.",
    "number.min": "Price cannot be less than 0.",
    "any.required": "Price is required.",
  }),

  size: Joi.array()
    .items(Joi.string().min(1).required().messages({
      "string.base": "Size must be a string.",
      "string.min": "Each size must be at least 1 character long.",
      "any.required": "Each size is required.",
    }))
    .min(1)
    .required()
    .messages({
      "array.base": "Size must be an array of strings.",
      "array.min": "At least one size is required.",
      "any.required": "Size is required.",
    }),

  color: Joi.array()
    .items(Joi.string().min(1).required().messages({
      "string.base": "Color must be a string.",
      "string.min": "Each color must be at least 1 character long.",
      "any.required": "Each color is required.",
    }))
    .min(1)
    .required()
    .messages({
      "array.base": "Color must be an array of strings.",
      "array.min": "At least one color is required.",
      "any.required": "Color is required.",
    }),

  commission: Joi.number().min(0).max(100).optional().messages({
    "number.base": "Commission must be a number.",
    "number.min": "Commission cannot be less than 0%.",
    "number.max": "Commission cannot exceed 100%.",
  }),

  is_approved: Joi.boolean().optional().messages({
    "boolean.base": "Is approved must be a boolean value.",
  }),

  stock_alert: Joi.number().integer().min(1).required().messages({
    "number.base": "Stock alert must be a number.",
    "number.integer": "Stock alert must be an integer.",
    "number.min": "Stock alert must be at least 1.",
    "any.required": "Stock alert is required.",
  }),

  quantities: Joi.array()
    .items(
      Joi.object({
        color: Joi.string().required().messages({
          "string.base": "Color must be a string.",
          "any.required": "Color is required.",
        }),
        size: Joi.string().required().messages({
          "string.base": "Size must be a string.",
          "any.required": "Size is required.",
        }),
        quantity: Joi.number().integer().min(0).required().messages({
          "number.base": "Quantity must be a number.",
          "number.integer": "Quantity must be an integer.",
          "number.min": "Quantity must be at least 0.",
          "any.required": "Quantity is required.",
        }),
      })
    )
    .required()
    .messages({
      "array.base": "Quantities must be an array of objects.",
      "any.required": "Quantities are required.",
    }),
});

// input validation for creating events
const createEventSchema = Joi.object({
  organizer_id: Joi.number().integer().required().messages({
    "number.base": "Organizer ID must be an integer.",
    "any.required": "Organizer ID is required.",
  }),
  title: Joi.string().min(3).max(100).required().messages({
    "string.base": "Title must be a string.",
    "string.min": "Title must be at least 3 characters long.",
    "string.max": "Title cannot exceed 100 characters.",
    "any.required": "Title is required.",
  }),
  description: Joi.string().required().messages({
    "string.base": "Description must be a string.",
    "any.required": "Description is required.",
  }),
  date_time: Joi.array()
  .items(
    Joi.string().isoDate().required().messages({
      "string.isoDate": "Each date and time must be in a valid ISO 8601 format.",
      "any.required": "Each date and time is required.",
    })
  )
  .min(1)
  .required()
  .messages({
    "array.base": "Date and time must be provided as an array.",
    "array.min": "At least one date and time must be provided.",
    "any.required": "Date and time are required.",
  })
,
  location: Joi.object({
    lat: Joi.number().required().messages({
      "number.base": "Latitude must be a number.",
      "any.required": "Latitude is required.",
    }),
    lng: Joi.number().required().messages({
      "number.base": "Longitude must be a number.",
      "any.required": "Longitude is required.",
    }),
    address: Joi.string().optional().messages({
      "string.base": "Address must be a string.",
      
    }),
  }).required().messages({
    "object.base": "Location must be an object with lat, lng, and address.",
    "any.required": "Location is required.",
  }),
  seated: Joi.boolean().required().messages({
    "boolean.base": "Seated must be a boolean value.",
    "any.required": "Seated is required.",
  }),
  ticket_maps: Joi.alternatives()
    .try(
      Joi.string().uri().messages({ "string.uri": "Ticket maps must be a valid URL." }),
      Joi.string().allow(null, "").messages({ "string.base": "Ticket maps can be an optional file upload." })
    )
    .messages({
      "alternatives.types": "Ticket maps must be either a valid URL or an uploaded file.",
    }),
  commission: Joi.number().min(0).max(100).optional().messages({
    "number.base": "Commission must be a number.",
    "number.min": "Commission cannot be less than 0%.",
    "number.max": "Commission cannot exceed 100%.",
  }),
  is_approved: Joi.boolean().optional().messages({
    "boolean.base": "Is approved must be a boolean value.",
  }),
 
});

// input validation for creating tickets
const createTicketsSchema = Joi.object({
  event_id: Joi.number().integer().required(),
  waves: Joi.string().optional(),
  amount_issued: Joi.number().integer().required(), // Total tickets issued
  price: Joi.array()
    .items(
      Joi.object({
        color: Joi.string().required(),
        price: Joi.number().required(),
      })
    )
    .required(),
  section: Joi.array()
    .items(
      Joi.object({
        color: Joi.string().required(),
        section: Joi.array().items(Joi.string()).required(),
        // quantity is optional, but if provided, must be a positive integer
      quantity: Joi.number().integer().min(1).optional(),
      })
    )
    .required(),
  total_seats: Joi.array()
    .items(
      Joi.object({
        section: Joi.string().required(),
        seats: Joi.number().integer().required(),
      })
    )
    .optional(),
    issued_at: Joi.date().optional(),
    
    ticket_alert: Joi.number().optional().messages({
      "number.base": "Ticket alert must be a number.",
    }),
});

// input validation for reserving 
const reserveTicketSchema = Joi.object({
  ticket_id: Joi.number().integer().required(),
  buyer_id: Joi.number().integer().required(),
  section: Joi.string().optional(),
  color: Joi.string().required(),
  amount: Joi.number().integer().min(1).required(), // Number of tickets to reserve
  seat_number: Joi.array().items(Joi.string()).min(1).optional(), // List of seat numbers
});

// input validation for confirming
const confirmPurchaseSchema = Joi.object({
  ticket_sold_id: Joi.number().integer().required(),
});

// input validation for canceling reservation
const cancelReservationSchema = Joi.object({
  ticket_sold_id: Joi.number().integer().required(),
});

const createNotificationSchema = Joi.object({
  user_id: Joi.number().integer().optional().allow(null),
  event_id: Joi.number().integer().optional().allow(null),
  blog_id: Joi.number().integer().optional().allow(null),
  product_id: Joi.number().integer().optional().allow(null),
  notification_type: Joi.string()
    .valid("organizer-approval", "event-approval", "blog-approval")
    .optional()
    .messages({
      "any.required": "Notification type is required.",
      "string.valid": "Invalid notification type.",
    }),
  alerts: Joi.string()
    .valid(
      "low-stock",
      "low-tickets",
      "report-event",
      "report-blog",
      "report-product"
    )
    .optional()
    .messages({
      "any.required": "Alert type is required.",
      "string.valid": "Invalid alert type.",
    }),
  message: Joi.string().max(255).optional().messages({
    "any.required": "Message is required.",
    "string.max": "Message cannot exceed 255 characters.",
  }),
});

// Joi Validation Schema for News
const newsValidationSchema = Joi.object({
  admin_id: Joi.number().integer().required().messages({
    'number.base': 'admin_id must be a number',
    'any.required': 'admin_id is required',
  }),
  title: Joi.string().required().messages({
    'string.base': 'Title must be a string',
    'any.required': 'Title is required',
  }),
  content: Joi.string().required().messages({
    'string.base': 'Content must be a string',
    'any.required': 'Content is required',
  }),
  category: Joi.string().required().messages({
    'string.base': 'Category must be a string',
    'any.required': 'Category is required',
  }),
  language: Joi.string().valid('en', 'ar').required().messages({
    'any.only': 'language must be either en or ar',
    'any.required': 'language is required',
  }),
  published_at: Joi.date().optional().messages({
    'date.base': 'Published date must be a valid date',
  }),
  images: Joi.array().items(Joi.string().uri()).optional().messages({
    'array.base': 'Images must be an array of URLs',
  }),
});

const advertisementValidationSchema = Joi.object({
  admin_id: Joi.number()
    .integer()
    .required()
    .messages({
      "number.base": "admin_id must be a number.",
      "any.required": "admin_id is required.",
    }),
  title: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      "string.base": "Title must be a string.",
      "string.min": "Title must be at least 3 characters long.",
      "string.max": "Title cannot exceed 100 characters.",
      "any.required": "Title is required.",
    }),
  description: Joi.string()
    .allow(null, "")
    .max(500)
    .messages({
      "string.base": "Description must be a string.",
      "string.max": "Description cannot exceed 500 characters.",
    }),
  target_audience: Joi.string()
    .allow(null, "")
    .max(255)
    .messages({
      "string.base": "Target audience must be a string.",
      "string.max": "Target audience cannot exceed 255 characters.",
    }),
  start_date: Joi.date()
    .iso()
    .required()
    .messages({
      "date.base": "Start date must be a valid ISO date.",
      "any.required": "Start date is required.",
    }),
  end_date: Joi.date()
    .iso()
    .greater(Joi.ref("start_date"))
    .required()
    .messages({
      "date.base": "End date must be a valid ISO date.",
      "date.greater": "End date must be after the start date.",
      "any.required": "End date is required.",
    }),
  images: Joi.array()
    .items(
      Joi.string().uri().messages({
        "string.uri": "Each image must be a valid URL.",
      })
    )
    .optional()
    .messages({
      "array.base": "Images must be an array of valid URLs.",
    }),
});
// Input validation schema for forget password
const forgetPasswordSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.email": "Email must be a valid email address.",
      "any.required": "Email is required.",
    }),
});

// Input validation schema for reset password
const resetPasswordSchema = Joi.object({
  token: Joi.string()
    .required()
    .messages({
      "string.base": "Token must be a string.",
      "any.required": "Token is required.",
    }),
  password: Joi.string()
    .min(8)
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters long.",
      "any.required": "Password is required.",
    }),
  confirmPassword: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .messages({
      "any.only": "Confirm password must match the new password.",
      "any.required": "Confirm password is required.",
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
    createProductSchema,
    createEventSchema,
    createTicketsSchema,
    reserveTicketSchema,
    confirmPurchaseSchema,
    cancelReservationSchema,
    createNotificationSchema ,
    newsValidationSchema,
    advertisementValidationSchema,
    forgetPasswordSchema,
    resetPasswordSchema,
    assignCategorySchema,
    removeCategorySchema,
};