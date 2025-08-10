import sequelize from '../config/database';
import Role from './Role';
import User from './User';
import Attachment from './Attachment';
import JobDescription from './JobDescription';

// Define associations
User.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });
Role.hasMany(User, { foreignKey: 'roleId', as: 'users' });

User.hasMany(Attachment, { 
  foreignKey: 'attachableId', 
  constraints: false,
  scope: { attachableType: 'User' },
  as: 'attachments'
});

Attachment.belongsTo(User, { 
  foreignKey: 'attachableId', 
  constraints: false,
  as: 'user'
});

User.hasMany(JobDescription, { foreignKey: 'userId', as: 'jobDescriptions' });
JobDescription.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export { sequelize, Role, User, Attachment, JobDescription };
export default sequelize; 