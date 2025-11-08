import { Router } from 'express';
import { prisma } from '../lib/prisma';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
});

export const filesRouter = Router();

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// GET /api/files - List files with search and filters
filesRouter.get('/', async (req, res) => {
  try {
    const {
      search = '',
      fileType,
      departmentId,
      page = '1',
      limit = '50',
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { fileName: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    if (fileType) {
      where.fileType = fileType;
    }

    if (departmentId) {
      where.departmentId = departmentId;
    }

    const [files, total] = await Promise.all([
      prisma.file.findMany({
        where,
        include: {
          department: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          [sortBy as string]: sortOrder as 'asc' | 'desc',
        },
        skip,
        take: limitNum,
      }),
      prisma.file.count({ where }),
    ]);

    const result = files.map((file) => ({
      id: file.id,
      name: file.name,
      fileName: file.fileName,
      fileType: file.fileType,
      fileSize: file.fileSize,
      url: file.url,
      department: file.department?.name,
      departmentId: file.departmentId,
      tags: file.tags,
      description: file.description,
      createdAt: file.createdAt.toISOString(),
      updatedAt: file.updatedAt.toISOString(),
    }));

    res.json({
      files: result,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ error: 'Failed to fetch files' });
  }
});

// POST /api/files - Upload a file
filesRouter.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { name, description, departmentId, tags } = req.body;
    const file = req.file;

    const fileType = path.extname(file.originalname).slice(1).toLowerCase();
    const fileName = file.originalname;

    // In production, you'd upload to S3, Cloudinary, etc.
    // For now, we'll store the file path
    const filePath = file.path;
    const url = `/uploads/${file.filename}`;

    const createdFile = await prisma.file.create({
      data: {
        name: name || fileName,
        fileName,
        fileType,
        fileSize: file.size,
        filePath,
        url,
        description: description || null,
        departmentId: departmentId || null,
        tags: tags ? (Array.isArray(tags) ? tags : tags.split(',')) : [],
        uploadedBy: req.body.uploadedBy || null,
      },
      include: {
        department: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.status(201).json({
      id: createdFile.id,
      name: createdFile.name,
      fileName: createdFile.fileName,
      fileType: createdFile.fileType,
      fileSize: createdFile.fileSize,
      url: createdFile.url,
      department: createdFile.department?.name,
      departmentId: createdFile.departmentId,
      tags: createdFile.tags,
      description: createdFile.description,
      createdAt: createdFile.createdAt.toISOString(),
    });
  } catch (error: any) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Failed to upload file', details: error.message });
  }
});

// DELETE /api/files/:id - Delete a file
filesRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const file = await prisma.file.findUnique({
      where: { id },
    });

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Delete physical file if it exists
    if (file.filePath && fs.existsSync(file.filePath)) {
      fs.unlinkSync(file.filePath);
    }

    await prisma.file.delete({
      where: { id },
    });

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

// GET /api/files/stats - Get file statistics
filesRouter.get('/stats', async (req, res) => {
  try {
    const [totalFiles, totalSize, byType] = await Promise.all([
      prisma.file.count(),
      prisma.file.aggregate({
        _sum: {
          fileSize: true,
        },
      }),
      prisma.file.groupBy({
        by: ['fileType'],
        _count: {
          id: true,
        },
      }),
    ]);

    res.json({
      totalFiles,
      totalSize: totalSize._sum.fileSize || 0,
      byType: byType.map((item) => ({
        type: item.fileType,
        count: item._count.id,
      })),
    });
  } catch (error) {
    console.error('Error fetching file stats:', error);
    res.status(500).json({ error: 'Failed to fetch file statistics' });
  }
});

