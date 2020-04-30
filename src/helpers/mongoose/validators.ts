import { Validator } from 'class-validator';

const validator = new Validator();

export const isEmpty = validator.isEmpty;
export const isNotEmpty = validator.isNotEmpty;
export const arrayNotEmpty = validator.arrayNotEmpty;
export const arrayUnique = validator.arrayUnique;
export const isArray = validator.isArray;
export const isBoolean = validator.isBoolean;
export const isDate = validator.isDate;
export const isString = validator.isString;
export const isNumber = validator.isNumber;
export const isInt = validator.isInt;
export const isEmail = validator.isEmail;
export const isJSON = validator.isJSON;
export const isPositive = validator.isPositive;
export const isNegative = validator.isNegative;
export const isLowercase = validator.isLowercase;
export const isUppercase = validator.isUppercase;

export const min = (num: number) => (value: number) => validator.min(value, num);
export const max = (num: number) => (value: number) => validator.max(value, num);
export const minDate = (date: number) => (value: number) => validator.min(value, date);
export const maxDate = (date: number) => (value: number) => validator.max(value, date);
export const length = (min: number, max: number) => (value: string) => validator.length(value, min, max);
export const minLength = (min: number) => (value: string) => validator.minLength(value, min);
export const maxLength = (max: number) => (value: string) => validator.maxLength(value, max);
export const equals = (text: string) => (value: number) => validator.equals(value, text);
export const notEquals = (text: string) => (value: number) => validator.notEquals(value, text);
export const contains = (seed: string) => (value: string) => validator.contains(value, seed);
export const notContains = (seed: string) => (value: string) => validator.notContains(value, seed);
export const isIn = (values: any[]) => (value: string) => validator.isIn(value, values);
export const isNotIn = (values: any[]) => (value: string) => validator.isNotIn(value, values);
export const matches = (regex: RegExp) => (value: string) => {
	return !!value.match(regex);
};
