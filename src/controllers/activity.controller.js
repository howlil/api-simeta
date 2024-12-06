const { PrismaClient } = require('@prisma/client');
const logger = require('../utils/logger');
const prisma = new PrismaClient();

const statusController = {
  getStatus: async (req, res) => {
    try {
      const { ta_id } = req.params;

      logger.info('Fetching thesis status', {
        userId: req.mahasiswa.id,
        ta_id
      });

      const status = await prisma.thesisStatus.findUnique({
        where: { ta_id },
        include: {
          ta: {
            include: {
              mahasiswa: true
            }
          },
          dosen: true
        }
      });

      if (!status) {
        logger.warn('Status not found', {
          userId: req.mahasiswa.id,
          ta_id
        });
        return res.status(404).json({
          success: false,
          message: 'Thesis status not found'
        });
      }

      logger.info('Successfully fetched thesis status', {
        userId: req.mahasiswa.id,
        ta_id,
        currentPhase: status.currentPhase
      });

      res.json({
        success: true,
        data: status
      });
    } catch (error) {
      logger.error('Error fetching thesis status', {
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

  updateStatus: async (req, res) => {
    try {
      const { ta_id } = req.params;
      const { currentPhase, progress, notes } = req.body;

      logger.info('Updating thesis status', {
        userId: req.mahasiswa.id,
        ta_id,
        currentPhase,
        progress
      });

      const status = await prisma.thesisStatus.update({
        where: { ta_id },
        data: {
          currentPhase,
          progress,
          notes,
          lastUpdate: new Date()
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

      logger.info('Successfully updated thesis status', {
        userId: req.mahasiswa.id,
        ta_id,
        currentPhase: status.currentPhase,
        progress: status.progress
      });

      res.json({
        success: true,
        data: status
      });
    } catch (error) {
      logger.error('Error updating thesis status', {
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

  getStatusOverview: async (req, res) => {
    try {
      const { ta_id } = req.params;

      logger.info('Fetching thesis status overview', {
        userId: req.mahasiswa.id,
        ta_id
      });

      // Get status with related data
      const status = await prisma.thesisStatus.findUnique({
        where: { ta_id },
        include: {
          ta: {
            include: {
              mahasiswa: true,
              milestone: {
                include: {
                  progress_TA: true
                }
              }
            }
          },
          dosen: true
        }
      });

      if (!status) {
        logger.warn('Status overview not found', {
          userId: req.mahasiswa.id,
          ta_id
        });
        return res.status(404).json({
          success: false,
          message: 'Thesis status not found'
        });
      }

      // Calculate additional metrics
      const overview = {
        status: status,
        completedMilestones: status.ta.milestone.filter(m => 
          m.progress_TA.some(p => p.status === 'completed')
        ).length,
        totalMilestones: status.ta.milestone.length,
        lastUpdate: status.lastUpdate,
        estimatedCompletion: status.targetDate
      };

      logger.info('Successfully fetched thesis status overview', {
        userId: req.mahasiswa.id,
        ta_id,
        currentPhase: status.currentPhase,
        progress: status.progress,
        completedMilestones: overview.completedMilestones
      });

      res.json({
        success: true,
        data: overview
      });
    } catch (error) {
      logger.error('Error fetching thesis status overview', {
        userId: req.mahasiswa.id,
        error: error.message,
        stack: error.stack
      });
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
};

module.exports = statusController;