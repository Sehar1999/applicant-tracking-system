import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from '../config/database';

class Attachment extends Model<InferAttributes<Attachment>, InferCreationAttributes<Attachment>> {
  declare id: CreationOptional<number>;
  declare fileUrl: string;
  declare fileType: string;
  declare attachableId: number;
  declare attachableType: string;
  declare uploadedAt: CreationOptional<Date>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Attachment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fileUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'file_url',
    },
    fileType: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'file_type',
    },
    attachableId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'attachable_id',
    },
    attachableType: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'attachable_type',
    },
    uploadedAt: {
      type: DataTypes.DATE,
      field: 'uploaded_at',
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',
    },
  },
  {
    sequelize,
    tableName: 'attachments',
    underscored: true,
  }
);

export default Attachment; 