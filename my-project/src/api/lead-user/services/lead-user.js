'use strict';

/**
 * lead-user service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::lead-user.lead-user');
