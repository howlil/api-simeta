const { PrismaClient } = require('@prisma/client');
const logger = require('../utils/logger');
const prisma = new PrismaClient();

const guidanceController = {
  createGuidance: async (req, res) => {
    try {
      logger.info('Creating new guidance schedule', {
        userId: req.mahasiswa.id,
        body: req.body
      });

      const guidance = await prisma.guidanceSchedule.create({
        data: {
          ...req.body,
          status: 'pending'
        },
        include: {
          ta: {
            include: {
              mahasiswa: true
            }
          },
          dosen: true
        }
      });

      logger.info('Successfully created guidance schedule', {
        userId: req.mahasiswa.id,
        guidanceId: guidance.id
      });

      res.status(201).json({
        success: true,
        data: guidance
      });
    } catch (error) {
      logger.error('Error creating guidance schedule', {
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

  getGuidanceSchedules: async (req, res) => {
    try {
      logger.info('Fetching all guidance schedules', {
        userId: req.mahasiswa.id
      });

      const schedules = await prisma.guidanceSchedule.findMany({
        include: {
          ta: {
            include: {
              mahasiswa: true
            }
          },
          dosen: true
        }
      });

      logger.info('Successfully fetched guidance schedules', {
        userId: req.mahasiswa.id,
        count: schedules.length
      });

      res.json({
        success: true,
        data: schedules
      });
    } catch (error) {
      logger.error('Error fetching guidance schedules', {
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

  getGuidanceById: async (req, res) => {
    try {
      const { id } = req.params;
      
      logger.info('Fetching guidance by id', {
        userId: req.mahasiswa.id,
        guidanceId: id
      });

      const guidance = await prisma.guidanceSchedule.findUnique({
        where: { id },
        include: {
          ta: {
            include: {
              mahasiswa: true
            }
          },
          dosen: true
        }
      });

      if (!guidance) {
        logger.warn('Guidance not found', {
          userId: req.mahasiswa.id,
          guidanceId: id
        });
        return res.status(404).json({
          success: false,
          message: 'Guidance schedule not found'
        });
      }

      logger.info('Successfully fetched guidance', {
        userId: req.mahasiswa.id,
        guidanceId: id
      });

      res.json({
        success: true,
        data: guidance
      });
    } catch (error) {
      logger.error('Error fetching guidance by id', {
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

  updateGuidance: async (req, res) => {
    try {
      const { id } = req.params;

      logger.info('Updating guidance schedule', {
        userId: req.mahasiswa.id,
        guidanceId: id,
        body: req.body
      });

      const guidance = await prisma.guidanceSchedule.update({
        where: { id },
        data: req.body,
        include: {
          ta: {
            include: {
              mahasiswa: true
            }
          },
          dosen: true
        }
      });

      logger.info('Successfully updated guidance schedule', {
        userId: req.mahasiswa.id,
        guidanceId: id
      });

      res.json({
        success: true,
        data: guidance
      });
    } catch (error) {
      logger.error('Error updating guidance schedule', {
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

module.exports = guidanceController;