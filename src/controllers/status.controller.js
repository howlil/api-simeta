const { PrismaClient } = require('@prisma/client');
const logger = require('../utils/logger');
const prisma = new PrismaClient();

const documentController = {
  createDocument: async (req, res) => {
    try {
      const { ta_id, dosen_id, documentType, title, version, fileUrl } = req.body;

      logger.info('Creating new thesis document', {
        userId: req.mahasiswa.id,
        ta_id,
        documentType
      });

      const document = await prisma.thesisDocument.create({
        data: {
          ta_id,
          dosen_id,
          documentType,
          title,
          version,
          fileUrl,
          status: 'draft',
          uploadDate: new Date()
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

      logger.info('Successfully created thesis document', {
        userId: req.mahasiswa.id,
        documentId: document.id,
        documentType
      });

      res.status(201).json({
        success: true,
        data: document
      });
    } catch (error) {
      logger.error('Error creating thesis document', {
        userId: req.mahasiswa.id,
        error: error.message,
        stack: error.stack,
        requestBody: req.body
      });
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  getDocuments: async (req, res) => {
    try {
      const { ta_id } = req.params;

      logger.info('Fetching thesis documents', {
        userId: req.mahasiswa.id,
        ta_id
      });

      const documents = await prisma.thesisDocument.findMany({
        where: { ta_id },
        include: {
          ta: {
            include: {
              mahasiswa: true
            }
          },
          dosen: true
        },
        orderBy: { uploadDate: 'desc' }
      });

      logger.info('Successfully fetched thesis documents', {
        userId: req.mahasiswa.id,
        ta_id,
        count: documents.length
      });

      res.json({
        success: true,
        data: documents
      });
    } catch (error) {
      logger.error('Error fetching thesis documents', {
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

  getDocumentById: async (req, res) => {
    try {
      const { id } = req.params;

      logger.info('Fetching thesis document by id', {
        userId: req.mahasiswa.id,
        documentId: id
      });

      const document = await prisma.thesisDocument.findUnique({
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

      if (!document) {
        logger.warn('Document not found', {
          userId: req.mahasiswa.id,
          documentId: id
        });
        return res.status(404).json({
          success: false,
          message: 'Document not found'
        });
      }

      logger.info('Successfully fetched thesis document', {
        userId: req.mahasiswa.id,
        documentId: id,
        documentType: document.documentType
      });

      res.json({
        success: true,
        data: document
      });
    } catch (error) {
      logger.error('Error fetching thesis document', {
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

  updateDocument: async (req, res) => {
    try {
      const { id } = req.params;
      const { status, comments } = req.body;

      logger.info('Updating thesis document', {
        userId: req.mahasiswa.id,
        documentId: id,
        newStatus: status
      });

      const document = await prisma.thesisDocument.update({
        where: { id },
        data: {
          status,
          comments: comments ? {
            push: {
              userId: req.mahasiswa.id,
              content: comments,
              date: new Date()
            }
          } : undefined
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

      logger.info('Successfully updated thesis document', {
        userId: req.mahasiswa.id,
        documentId: id,
        newStatus: document.status
      });

      res.json({
        success: true,
        data: document
      });
    } catch (error) {
      logger.error('Error updating thesis document', {
        userId: req.mahasiswa.id,
        error: error.message,
        stack: error.stack,
        requestBody: req.body
      });
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  deleteDocument: async (req, res) => {
    try {
      const { id } = req.params;

      logger.info('Deleting thesis document', {
        userId: req.mahasiswa.id,
        documentId: id
      });

      await prisma.thesisDocument.delete({
        where: { id }
      });

      logger.info('Successfully deleted thesis document', {
        userId: req.mahasiswa.id,
        documentId: id
      });

      res.json({
        success: true,
        message: 'Document deleted successfully'
      });
    } catch (error) {
      logger.error('Error deleting thesis document', {
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

module.exports = documentController;