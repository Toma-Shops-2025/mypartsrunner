const nodemailer = require('nodemailer');

// Email configuration
const transporter = nodemailer.createTransporter({
  service: 'gmail', // or use your preferred email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const body = JSON.parse(event.body);
    const { type, to, applicationData, status, adminNotes } = body;

    let emailContent;
    let subject;

    switch (type) {
      case 'application_received':
        subject = 'Driver Application Received - MyPartsRunner';
        emailContent = generateApplicationReceivedEmail(applicationData);
        break;
      
      case 'status_update':
        subject = `Driver Application ${status.toUpperCase()} - MyPartsRunner`;
        emailContent = generateStatusUpdateEmail(applicationData, status, adminNotes);
        break;
      
      case 'approved':
        subject = '🎉 Driver Application Approved - MyPartsRunner';
        emailContent = generateApprovedEmail(applicationData);
        break;
      
      case 'rejected':
        subject = 'Driver Application Update - MyPartsRunner';
        emailContent = generateRejectedEmail(applicationData, adminNotes);
        break;
      
      default:
        throw new Error('Invalid email type');
    }

    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: subject,
      html: emailContent
    };

    await transporter.sendMail(mailOptions);

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'Email sent successfully',
        type: type,
        to: to
      })
    };

  } catch (error) {
    console.error('Email sending error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Failed to send email: ${error.message}` })
    };
  }
};

// Email template functions
function generateApplicationReceivedEmail(applicationData) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">🚗 Driver Application Received!</h2>
      
      <p>Hi ${applicationData.first_name},</p>
      
      <p>Thank you for applying to be a MyPartsRunner driver! We've received your application and are excited about the possibility of having you join our team.</p>
      
      <h3>Application Details:</h3>
      <ul>
        <li><strong>Application ID:</strong> ${applicationData.id}</li>
        <li><strong>Name:</strong> ${applicationData.first_name} ${applicationData.last_name}</li>
        <li><strong>Email:</strong> ${applicationData.email}</li>
        <li><strong>Vehicle:</strong> ${applicationData.vehicle_year} ${applicationData.vehicle_make} ${applicationData.vehicle_model}</li>
      </ul>
      
      <h3>What Happens Next?</h3>
      <ol>
        <li>Our team will review your application within 2-3 business days</li>
        <li>We'll verify your documents and background information</li>
        <li>You'll receive an email with the decision and next steps</li>
      </ol>
      
      <p><strong>Application Status:</strong> <span style="color: #059669; font-weight: bold;">PENDING REVIEW</span></p>
      
      <p>You can check your application status anytime by visiting your driver dashboard.</p>
      
      <p>If you have any questions, please don't hesitate to contact us.</p>
      
      <p>Best regards,<br>The MyPartsRunner Team</p>
    </div>
  `;
}

function generateStatusUpdateEmail(applicationData, status, adminNotes) {
  const statusColors = {
    'under_review': '#f59e0b',
    'approved': '#059669',
    'rejected': '#dc2626',
    'on_hold': '#6b7280'
  };

  const statusText = status.replace('_', ' ').toUpperCase();
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Driver Application Update</h2>
      
      <p>Hi ${applicationData.first_name},</p>
      
      <p>Your driver application status has been updated.</p>
      
      <h3>Current Status:</h3>
      <p><strong style="color: ${statusColors[status]};">${statusText}</strong></p>
      
      ${adminNotes ? `<h3>Admin Notes:</h3><p>${adminNotes}</p>` : ''}
      
      <p>Application ID: ${applicationData.id}</p>
      
      <p>Please check your driver dashboard for more details and next steps.</p>
      
      <p>Best regards,<br>The MyPartsRunner Team</p>
    </div>
  `;
}

function generateApprovedEmail(applicationData) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #059669;">🎉 Congratulations! Your Application is Approved!</h2>
      
      <p>Hi ${applicationData.first_name},</p>
      
      <p>Great news! Your driver application has been approved. Welcome to the MyPartsRunner team!</p>
      
      <h3>Next Steps:</h3>
      <ol>
        <li><strong>Complete Driver Onboarding:</strong> Visit your dashboard to complete the onboarding process</li>
        <li><strong>Document Verification:</strong> Ensure all your documents are up to date</li>
        <li><strong>Training:</strong> Complete the required driver training modules</li>
        <li><strong>Start Driving:</strong> Begin accepting delivery requests</li>
      </ol>
      
      <p><strong>Application ID:</strong> ${applicationData.id}</p>
      
      <p>Please log into your MyPartsRunner account and complete the onboarding process to start earning!</p>
      
      <p>If you have any questions, our support team is here to help.</p>
      
      <p>Welcome aboard! 🚗</p>
      
      <p>Best regards,<br>The MyPartsRunner Team</p>
    </div>
  `;
}

function generateRejectedEmail(applicationData, adminNotes) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #dc2626;">Driver Application Update</h2>
      
      <p>Hi ${applicationData.first_name},</p>
      
      <p>Thank you for your interest in becoming a MyPartsRunner driver. After careful review, we regret to inform you that we are unable to approve your application at this time.</p>
      
      ${adminNotes ? `<h3>Reason:</h3><p>${adminNotes}</p>` : ''}
      
      <h3>What This Means:</h3>
      <ul>
        <li>Your application will not proceed further</li>
        <li>You may reapply in the future if circumstances change</li>
        <li>We encourage you to address any issues mentioned above</li>
      </ul>
      
      <p><strong>Application ID:</strong> ${applicationData.id}</p>
      
      <p>If you believe this decision was made in error or have questions, please contact our support team.</p>
      
      <p>We appreciate your interest in MyPartsRunner and wish you the best in your future endeavors.</p>
      
      <p>Best regards,<br>The MyPartsRunner Team</p>
    </div>
  `;
} 