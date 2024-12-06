const { PrismaClient } = require('@prisma/client');
const logger = require('../utils/logger');
const prisma = new PrismaClient();

const documentController = {
  getAllDocuments: async (req, res) => {
    const { ta_id } = req.params;
    
    try {
      logger.info('Fetching all thesis documents', {
        userId: req.mahasiswa.id,
        ta_id
      });

      const documents = await prisma.thesisDocument.findMany({
        where: {
          ta_id: ta_id
        },
        include: {
          ta: {
            include: {
              mahasiswa: true
            }
          },
          dosen: true
        },
        orderBy: {
          uploadDate: 'desc'
        }
      });

      logger.info('Successfully fetched thesis documents', {
        userId: req.mahasiswa.id,
        ta_id,
        count: documents.length
      });

      res.json({
        status: 'success',
        data: documents
      });
    } catch (error) {
      logger.error('Error fetching thesis documents', {
        userId: req.mahasiswa.id,
        ta_id,
        error: error.message,
        stack: error.stack
      });

      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  },

  getDocumentById: async (req, res) => {
    const { ta_id, documentId } = req.params;
    
    try {
      logger.info('Fetching thesis document detail', {
        userId: req.mahasiswa.id,
        ta_id,
        documentId
      });

      const document = await prisma.thesisDocument.findFirst({
        where: {
          id: documentId,
          ta_id: ta_id
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

      if (!document) {
        logger.warn('Thesis document not found', {
          userId: req.mahasiswa.id,
          ta_id,
          documentId
        });

        return res.status(404).json({
          status: 'error',
          message: 'Dokumen tidak ditemukan'
        });
      }

      logger.info('Successfully fetched thesis document detail', {
        userId: req.mahasiswa.id,
        ta_id,
        documentId,
        documentType: document.documentType,
        version: document.version
      });

      res.json({
        status: 'success',
        data: document
      });
    } catch (error) {
      logger.error('Error fetching thesis document detail', {
        userId: req.mahasiswa.id,
        ta_id,
        documentId,
        error: error.message,
        stack: error.stack
      });

      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  },

  uploadDocument: async (req, res) => {
    const { ta_id } = req.params;
    const { title, documentType, version, fileUrl, dosen_id } = req.body;
    
    try {
      logger.info('Uploading new thesis document', {
        userId: req.mahasiswa.id,
        ta_id,
        documentType,
        version
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

      logger.info('Successfully uploaded thesis document', {
        userId: req.mahasiswa.id,
        ta_id,
        documentId: document.id,
        documentType: document.documentType,
        version: document.version
      });

      res.status(201).json({
        status: 'success',
        data: document
      });
    } catch (error) {
      logger.error('Error uploading thesis document', {
        userId: req.mahasiswa.id,
        ta_id,
        error: error.message,
        stack: error.stack,
        requestBody: req.body
      });

      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  },

  updateDocumentStatus: async (req, res) => {
    const { ta_id, documentId } = req.params;
    const { status, comments } = req.body;
    
    try {
      logger.info('Updating thesis document status', {
        userId: req.mahasiswa.id,
        ta_id,
        documentId,
        newStatus: status
      });

      const document = await prisma.thesisDocument.update({
        where: {
          id: documentId,
          ta_id: ta_id
        },
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

      logger.info('Successfully updated thesis document status', {
        userId: req.mahasiswa.id,
        ta_id,
        documentId,
        oldStatus: document.status,
        newStatus: status
      });

      res.json({
        status: 'success',
        data: document
      });
    } catch (error) {
      logger.error('Error updating thesis document status', {
        userId: req.mahasiswa.id,
        ta_id,
        documentId,
        error: error.message,
        stack: error.stack,
        requestBody: req.body
      });

      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  }
};

module.exports = documentController;