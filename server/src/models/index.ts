import sequelize from '../config/database';
import Role from './Role';
import User from './User';
import Attachment from './Attachment';

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

export { sequelize, Role, User, Attachment };
export default sequelize; 