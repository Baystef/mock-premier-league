import { check, param } from 'express-validator';

/**
 * @description Checks all fields of the auth request body
 */
const addTeamValidate = [
  check('teamName').not().isEmpty()
    .withMessage('Team name is required')
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Team name should not be less than 2 characters'),

  check('noOfPlayers')
    .isNumeric()
    .withMessage('Must be a number')
    .isInt({ min: 11, max: 100 })
    .withMessage('Minimum No of players is 11 and Maximum is 100'),

  check('coach').trim()
    .matches(/^[a-zA-Z]+( +[a-zA-Z]+)*$/)
    .withMessage('Coach name should contain alphabets only')
    .isLength({ min: 3, max: 255 })
    .withMessage('Coach name should not be less than 2 characters')
];

const getTeamValidate = [
  check('teamName').optional().isLength({ min: 3, max: 25 })
    .withMessage('Team name should be between 3 and 25 characters'),

  check('coach').optional().matches(/^[a-zA-Z]+( +[a-zA-Z]+)*$/)
    .withMessage('Coach name must be alphabets')
    .isLength({ min: 3, max: 50 })
    .withMessage('Coach name should be between 3 and 50 characters')
];

const updateTeamValidate = [
  param('teamName').not().isEmpty()
    .withMessage('Team name param is required')
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Team name should not be less than 2 characters'),

  check('teamName').optional().trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Team name should not be less than 2 characters'),

  check('noOfPlayers').optional()
    .isNumeric()
    .withMessage('Must be a number')
    .isInt({ min: 11, max: 100 })
    .withMessage('Minimum No of players is 11 and Maximum is 100'),

  check('coach').optional().trim()
    .matches(/^[a-zA-Z]+( +[a-zA-Z]+)*$/)
    .withMessage('Coach name should contain alphabets only')
    .isLength({ min: 3, max: 255 })
    .withMessage('Coach name should not be less than 2 characters')
];

const deleteTeamValidate = [
  addTeamValidate[0]
];

export {
  addTeamValidate, getTeamValidate, updateTeamValidate, deleteTeamValidate,
};
