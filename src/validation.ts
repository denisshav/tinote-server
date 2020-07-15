import Joi from "joi"

export const registerValidation = (data: any) => {
  const schema = {
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).required(),
  }

  return Joi.validate(data, schema)
}

export const loginValidation = (data: any) => {
  const schema = {
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).required(),
  }

  return Joi.validate(data, schema)
}

export const validateNote = (note: any, requiredId: boolean = false) => {
  const schema = {
    _id: requiredId ? Joi.string().required() : Joi.string(),
    title: Joi.string().min(3).required(),
    content: Joi.string().min(0).allow("").allow(null).required(),
    folder: Joi.string().min(1).required(),
    date: Joi.date().required(),
  }
  return Joi.validate(note, schema)
}

export const validateFolder = (folder: any, requiredId: boolean = false) => {
  const schema = {
    _id: requiredId ? Joi.string().required() : Joi.string(),
    name: Joi.string().min(3).required(),
    color: Joi.string().min(0).required(),
    icon: Joi.string().min(1).required(),
  }
  return Joi.validate(folder, schema)
}
