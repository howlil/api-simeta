const { PrismaClient } = require('@prisma/client');
const logger = require('../utils/logger');
const prisma = new PrismaClient();

const activityController = {
  createActivity: async (req, res) => {
    try {
      logger.info('Creating new activity', {
        userId: req.mahasiswa.id,
        body: req.body
      });

      const activity = await prisma.thesisActivity.create({
        data: {
          ...req.body,
          status: 'planned'
        },
        include: {
          ta: {
            include: {
              mahasiswa: true
            }
          }
        }
      });

      logger.info('Successfully created activity', {
        userId: req.mahasiswa.id,
        activityId: activity.id
      });

      res.status(201).json({
        success: true,
        data: activity
      });
    } catch (error) {
      logger.error('Error creating activity', {
        userId: req.mahasiswa.id,
        error: error.message,
        stack: error.stack
      });
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  getActivities: async (req, res) => {
    try {
      const { ta_id } = req.params;

      logger.info('Fetching activities by TA ID', {
        userId: req.mahasiswa.id,
        ta_id
      });

      const activities = await prisma.thesisActivity.findMany({
        where: { ta_id },
        include: {
          ta: {
            include: {
              mahasiswa: true
            }
          }
        },
        orderBy: { date: 'desc' }
      });

      logger.info('Successfully fetched activities', {
        userId: req.mahasiswa.id,
        ta_id,
        count: activities.length
      });

      res.json({
        success: true,
        data: activities
      });
    } catch (error) {
      logger.error('Error fetching activities', {
        userId: req.mahasiswa.id,
        error: error.message,
        stack: error.stack
      });
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  getActivityById: async (req, res) => {
    try {
      const { id } = req.params;

      logger.info('Fetching activity by id', {
        userId: req.mahasiswa.id,
        activityId: id
      });

      const activity = await prisma.thesisActivity.findUnique({
        where: { id },
        include: {
          ta: {
            include: {
              mahasiswa: true
            }
          }
        }
      });

      if (!activity) {
        logger.warn('Activity not found', {
          userId: req.mahasiswa.id,
          activityId: id
        });
        return res.status(404).json({
          success: false,
          message: 'Activity not found'
        });
      }

      logger.info('Successfully fetched activity', {
        userId: req.mahasiswa.id,
        activityId: id
      });

      res.json({
        success: true,
        data: activity
      });
    } catch (error) {
      logger.error('Error fetching activity', {
        userId: req.mahasiswa.id,
        error: error.message,
        stack: error.stack
      });
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  updateActivity: async (req, res) => {
    try {
      const { id } = req.params;

      logger.info('Updating activity', {
        userId: req.mahasiswa.id,
        activityId: id,
        body: req.body
      });

      const activity = await prisma.thesisActivity.update({
        where: { id },
        data: req.body,
        include: {
          ta: {
            include: {
              mahasiswa: true
            }
          }
        }
      });

      logger.info('Successfully updated activity', {
        userId: req.mahasiswa.id,
        activityId: id
      });

      res.json({
        success: true,
        data: activity
      });
    } catch (error) {
      logger.error('Error updating activity', {
        userId: req.mahasiswa.id,
        error: error.message,
        stack: error.stack
      });
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  deleteActivity: async (req, res) => {
    try {
      const { id } = req.params;

      logger.info('Deleting activity', {
        userId: req.mahasiswa.id,
        activityId: id
      });

      await prisma.thesisActivity.delete({
        where: { id }
      });

      logger.info('Successfully deleted activity', {
        userId: req.mahasiswa.id,
        activityId: id
      });

      res.json({
        success: true,
        message: 'Activity deleted successfully'
      });
    } catch (error) {
      logger.error('Error deleting activity', {
        userId: req.mahasiswa.id,
        error: error.message,
        stack: error.stack
      });
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
};

module.exports = activityController;