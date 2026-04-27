/* eslint-disable global-require, import/no-dynamic-require */
import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import { sequelize } from '../config/db';

const basename = path.basename(__filename);
const db = {};

// Auto-load all .js model files in this directory (except index.js)
fs.readdirSync(__dirname)
  .filter((file) => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js')
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Run associations, seed data, and scopes
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) db[modelName].associate(db);
  if (db[modelName].seedData) db[modelName].seedData();
  if (db[modelName].loadScopes) db[modelName].loadScopes(db);
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Named exports for convenience
export { sequelize, Sequelize };
export const { User } = db;
export const { Admin } = db;
export const { ChatRoom } = db;
export const { ChatRoomMember } = db;
export const { ChatMessage } = db;
export const { ChatMessageRead } = db;
export const { ClientProject } = db;
export const { Category } = db;
export const { SubCategory } = db;
export const { Technology } = db;
export const { ProjectBid } = db;
export const { CandidateProfile } = db;
export const { ProjectDetail } = db;
export const { ContactUs } = db;
export const { UserActivity } = db;
export const { Transaction } = db;
export const { Sow } = db;
export const { Project } = db;
export const { SavedProject } = db;
export const { SowInput } = db;
export const { ProfessionalDetail } = db;
export const { Education } = db;
export const { Certificate } = db;
export const { Thumbnail } = db;
export const { ThumbnailImage } = db;
export const { Video } = db;
export const { InternalData } = db;
export const { InternalImage } = db;
export const { Industry } = db;
export const { CustomerIndustries } = db;
export const { LogManager } = db;
export const { ProjectBidMilestone } = db;
export const { WebsiteData } = db;
export const { UserFunction } = db;
export const { Designation } = db;
export const { ClientBillingDetails } = db;
export const { FreelancerCurrentCountryPreference } = db;
export const { FreelancerCv } = db;
export const { SaleOrderAndInvoices } = db;
export const { Feedback } = db;
export const { Blog } = db;
export const { EmailDomainAnalysis } = db;
export const { ProcessingBatch } = db;
export const { CategoryDatabase } = db;
export const { HtmlTemplate } = db;
export const { EmailCampaign } = db;
export const { CampaignBatch } = db;
export const { Payment } = db;
export const { ProfessionalDetailSubCategory } = db;
export const { ClientProjectSubCategory } = db;
export const { Dispute } = db;
export const { HalogigTestimonial } = db;
export const { Device } = db;
export const { WorkSession } = db;
export const { Activity } = db;
export const { Screenshot } = db;
export const { ProfileCompleteReminder } = db;
export const { Token } = db;
export const { ReportProblem } = db;
export const { WebRotData } = db;
export const { WebRotHistory } = db;
export const { WebRotJob } = db;
export const { WebRotJobResult } = db;
export const { SalesReferralLead } = db;
export const { ChatMeeting } = db;
export const { InAppNotification } = db;
export const { AdminNotification } = db;
export const { GeneratedBill } = db;
export const { Country } = db;
export const { PasswordResetToken } = db;

export default db;
