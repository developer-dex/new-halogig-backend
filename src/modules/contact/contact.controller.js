import asyncHandler from '../../utils/asyncHandler';
import getHttpStatus from '../../utils/httpStatus';
import getMessage from '../../utils/message';
import contactService from './contact.service';

/**
 * POST /api/contact-us
 * Create a new contact inquiry and send admin notification email.
 */
const createContact = asyncHandler(async (req, res) => {
  const {
    firstName, lastName, email, mobile, companyName, requirements,
  } = req.body;

  // Save to database
  const result = await contactService.createContact({
    first_name: firstName,
    last_name: lastName,
    email,
    mobile,
    company_name: companyName,
    requirements,
    is_client_added: false,
  });

  // Fire-and-forget admin notification email
  contactService.sendContactNotificationEmail({
    firstName, lastName, email, mobile, companyName, requirements,
  });

  res.status(getHttpStatus('OK')).json({
    success: true,
    data: result,
    message: getMessage(req, false, 'CONTACT_CREATED_SUCCESS'),
  });
});

export default {
  createContact,
};
