const prisma = require("../configs/db");
const { createBimbinganSchema, updateBimbinganSchema } = require("../validations/bimbingan.validation");
const { logger } = require("../utils/logging");

exports.createBimbingan = async (req, res) => {
    try {
      const { ta_id } = req.params; // Ambil TA ID dari params
      const { error, messages, data } = await createBimbinganSchema.validate(req.body, {
        abortEarly: false,
      });
  
      if (error) {
        return res.status(400).json({ error: true, messages });
      }
  
      // Validasi apakah TA ada
      const ta = await prisma.tA.findUnique({
        where: { id: ta_id },
        include: {
          dospem: true, // Sertakan informasi dospem untuk validasi
        },
      });
  
      if (!ta) {
        return res.status(404).json({ error: true, messages: "TA not found" });
      }
  
      // Validasi apakah dosen_id adalah dospem milik TA
      const isDospemValid = ta.dospem.some((dospem) => dospem.dosen_id === data.dosen_id);
      if (!isDospemValid) {
        return res.status(403).json({
          error: true,
          messages: "Selected dospem is not associated with this TA",
        });
      }
  
      const bimbingan = await prisma.bimbingan_TA.create({
        data: {
          tanggal: data.tanggal,
          aktifitas: data.aktifitas,
          status: data.status,
          ta_id: ta_id, // Gunakan TA ID dari params
          dosen_id: data.dosen_id, // Menyimpan ID dosen yang dipilih
        },
      });
  
      logger.info("Jadwal Bimbingan created successfully");
      res.status(201).json({
        error: false,
        messages: "Jadwal Bimbingan created successfully",
        data: bimbingan,
      });
    } catch (err) {
      logger.error(`Error creating jadwal bimbingan: ${err.message}`);
      res.status(500).json({ error: true, messages: "Internal server error" });
    }
  };
  
  exports.getBimbinganByTA = async (req, res) => {
    try {
      const { ta_id } = req.params;
  
      const bimbinganList = await prisma.bimbingan_TA.findMany({
        where: { ta_id },
        include: {
          dosen: true, // Sertakan informasi dosen yang terkait dengan bimbingan
        },
        orderBy: { tanggal: "asc" }, // Urutkan berdasarkan tanggal
      });
  
      if (!bimbinganList.length) {
        return res.status(404).json({
          error: true,
          messages: "No Bimbingan found for this TA",
        });
      }
  
      res.status(200).json({
        error: false,
        messages: "Success",
        data: bimbinganList,
      });
    } catch (err) {
      logger.error(`Error retrieving jadwal bimbingan: ${err.message}`);
      res.status(500).json({ error: true, messages: "Internal server error" });
    }
  };
  

  exports.updateBimbingan = async (req, res) => {
    try {
      const { id, ta_id } = req.params;
  
      const { error, messages, data } = await updateBimbinganSchema.validate(req.body, {
        abortEarly: false,
      });
  
      if (error) {
        return res.status(400).json({ error: true, messages });
      }
  
      const bimbingan = await prisma.bimbingan_TA.findUnique({
        where: { id },
        include: {
          ta: true, // Sertakan informasi TA untuk validasi
        },
      });
  
      if (!bimbingan) {
        return res.status(404).json({ error: true, messages: "Bimbingan not found" });
      }
  
      // Pastikan bimbingan terkait dengan TA dari params
      if (bimbingan.ta_id !== ta_id) {
        return res.status(403).json({
          error: true,
          messages: "This Bimbingan does not belong to the specified TA",
        });
      }
  
      const updatedBimbingan = await prisma.bimbingan_TA.update({
        where: { id },
        data,
      });
  
      logger.info(`Jadwal Bimbingan ${id} updated successfully`);
      res.status(200).json({
        error: false,
        messages: "Jadwal Bimbingan updated successfully",
        data: updatedBimbingan,
      });
    } catch (err) {
      logger.error(`Error updating jadwal bimbingan: ${err.message}`);
      res.status(500).json({ error: true, messages: "Internal server error" });
    }
  };
  
  exports.deleteBimbingan = async (req, res) => {
    try {
      const { id, ta_id } = req.params;
  
      const bimbingan = await prisma.bimbingan_TA.findUnique({
        where: { id },
      });
  
      if (!bimbingan) {
        return res.status(404).json({
          error: true,
          messages: "Bimbingan not found",
        });
      }
  
      if (bimbingan.ta_id !== ta_id) {
        return res.status(403).json({
          error: true,
          messages: "This Bimbingan does not belong to the specified TA",
        });
      }
  
      await prisma.bimbingan_TA.delete({ where: { id } });
  
      logger.info(`Jadwal Bimbingan ${id} deleted successfully`);
      res.status(200).json({
        error: false,
        messages: "Jadwal Bimbingan deleted successfully",
      });
    } catch (err) {
      logger.error(`Error deleting jadwal bimbingan: ${err.message}`);
      res.status(500).json({ error: true, messages: "Internal server error" });
    }
  };
  
exports.getDospemByMahasiswa = async (req, res) => {
    try {
      const { mahasiswa_id } = req.params; // ID mahasiswa diambil dari parameter URL
  
      // Cari TA milik mahasiswa
      const ta = await prisma.tA.findUnique({
        where: { mahasiswa_id },
        include: {
          dospem: {
            include: {
              dosen: true, // Sertakan informasi detail dosen
            },
          },
        },
      });
  
      if (!ta) {
        return res.status(404).json({
          error: true,
          messages: "TA not found for this mahasiswa",
        });
      }
  
      // Format response untuk hanya menampilkan dospem
      const dospemList = ta.dospem.map((dospem) => ({
        dosen_id: dospem.dosen.id,
        full_name: dospem.dosen.full_name,
        nip: dospem.dosen.nip,
        position: dospem.dosen.position,
      }));
  
      res.status(200).json({
        error: false,
        messages: "Success",
        data: dospemList,
      });
    } catch (err) {
      logger.error(`Error retrieving dospem: ${err.message}`);
      res.status(500).json({
        error: true,
        messages: "Internal server error",
      });
    }
  };
  