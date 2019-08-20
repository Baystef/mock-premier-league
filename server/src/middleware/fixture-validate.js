import { check } from 'express-validator';

/**
 * @description Checks all fields of the auth request body
 */
const addFixtureValidate = [
  check('homeTeam').not().isEmpty()
    .withMessage('Team name is required')
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Team name should not be less than 2 characters'),

  check('awayTeam').not().isEmpty()
    .withMessage('Team name is required')
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Team name should not be less than 2 characters'),

  check('fixtureDate').optional().isISO8601()
    .withMessage('Invalid date format. Use format YYYY-MM-DD'),
];

const getFixtureValidate = [
  check('fixtureLink').optional().matches(/^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$/)
    .withMessage('Fixture link is invalid')
    .isLength({ min: 32, max: 32 })
    .withMessage('Fixture link is invalid'),

  check('status').optional().isIn(['pending', 'completed'])
    .withMessage('Status query must either be "completed" or "pending"')
];

const updateFixtureValidate = [
  getFixtureValidate[0],

  check('homeTeam').optional()
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Team name should not be less than 2 characters'),

  check('awayTeam').optional()
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Team name should not be less than 2 characters'),

  check('fixtureDate').optional().isISO8601()
    .withMessage('Invalid date format. Use format YYYY-MM-DD'),
];

const deleteFixtureValidate = [
  getFixtureValidate[0],
];

export {
  addFixtureValidate, getFixtureValidate, updateFixtureValidate, deleteFixtureValidate,
};
