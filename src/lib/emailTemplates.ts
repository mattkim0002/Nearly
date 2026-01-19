// Email Templates for Nearly Platform
// Location: src/lib/emailTemplates.ts
// These are template strings that can be used with your email service (SendGrid, AWS SES, etc.)

export const emailTemplates = {
  
  // 1. WELCOME EMAIL - NEW CLIENT
  welcomeClient: (userName: string) => ({
    subject: "Welcome to Nearly! 👋",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #334155; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #0EA5E9 0%, #2563EB 100%); padding: 30px; text-align: center; border-radius: 12px; margin-bottom: 30px; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .content { background: white; padding: 30px; border-radius: 12px; border: 2px solid #E2E8F0; }
          .button { display: inline-block; background: #0EA5E9; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .notice { background: #FEF3C7; border: 2px solid #FCD34D; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .footer { text-align: center; color: #94A3B8; font-size: 14px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Nearly!</h1>
          </div>
          
          <div class="content">
            <p>Hi ${userName},</p>
            
            <p>Thanks for joining Nearly! We're excited to help you connect with talented independent local workers for your commissions.</p>
            
            <h3>Here's how to get started:</h3>
            <ol>
              <li><strong>Post a Commission:</strong> Describe what you need and set your budget</li>
              <li><strong>Review Proposals:</strong> Independent workers will submit proposals with their timeline and pricing</li>
              <li><strong>Choose Your Worker:</strong> Select the best fit for your needs</li>
              <li><strong>Secure Payment:</strong> Payment is held in escrow per your agreed terms</li>
            </ol>
            
            <div class="notice">
              <strong>⚠️ Important: Nearly's Role</strong><br>
              Nearly facilitates connections and payment processing only. We do not employ workers, guarantee work quality, or control how services are performed. You are responsible for vetting workers, defining clear terms, and managing your commissions.
            </div>
            
            <a href="https://nearly.com/post-job" class="button">Post Your First Commission</a>
            
            <p>Need help? Check out our <a href="https://nearly.com/faq">Help Center</a> or email us at support@nearly.com</p>
            
            <p>Welcome aboard!<br>The Nearly Team</p>
          </div>
          
          <div class="footer">
            <p>© 2026 Nearly. All rights reserved.<br>
            <a href="https://nearly.com/privacy">Privacy Policy</a> | <a href="https://nearly.com/faq">Help Center</a></p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Welcome to Nearly!

Hi ${userName},

Thanks for joining Nearly! We're excited to help you connect with talented independent local workers for your commissions.

Here's how to get started:
1. Post a Commission: Describe what you need and set your budget
2. Review Proposals: Independent workers will submit proposals with their timeline and pricing
3. Choose Your Worker: Select the best fit for your needs
4. Secure Payment: Payment is held in escrow per your agreed terms

IMPORTANT: Nearly facilitates connections and payment processing only. We do not employ workers, guarantee work quality, or control how services are performed. You are responsible for vetting workers, defining clear terms, and managing your commissions.

Get started: https://nearly.com/post-job

Need help? Check out our Help Center at https://nearly.com/faq or email support@nearly.com

Welcome aboard!
The Nearly Team`
  }),

  // 2. WELCOME EMAIL - NEW WORKER
  welcomeWorker: (userName: string) => ({
    subject: "Welcome to Nearly! Start Finding Commissions 🚀",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #334155; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #0EA5E9 0%, #2563EB 100%); padding: 30px; text-align: center; border-radius: 12px; margin-bottom: 30px; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .content { background: white; padding: 30px; border-radius: 12px; border: 2px solid #E2E8F0; }
          .button { display: inline-block; background: #0EA5E9; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .tip { background: #DBEAFE; border-left: 4px solid #0EA5E9; padding: 15px; margin: 15px 0; }
          .footer { text-align: center; color: #94A3B8; font-size: 14px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Nearly!</h1>
          </div>
          
          <div class="content">
            <p>Hi ${userName},</p>
            
            <p>Welcome to Nearly! We're excited to help you connect with local clients looking for your skills.</p>
            
            <h3>Get Started in 3 Steps:</h3>
            <ol>
              <li><strong>Complete Your Profile:</strong> Add your bio, skills, portfolio, and pricing</li>
              <li><strong>Browse Commissions:</strong> Find work that matches your expertise</li>
              <li><strong>Submit Proposals:</strong> Send proposals to clients explaining why you're the best fit</li>
            </ol>
            
            <div class="tip">
              <strong>💡 Pro Tip:</strong> A complete profile with portfolio examples gets 3x more responses! Showcase your best work to stand out.
            </div>
            
            <h3>How You Get Paid:</h3>
            <p>When a client accepts your proposal, payment is deposited into secure escrow. Complete the work according to your agreed terms and submit it for review. Once the client approves, payment is released to your account.</p>
            
            <p><em>Remember: You are responsible for delivering work that meets the terms you agreed to with the client. Nearly facilitates payment processing but does not determine when work is complete.</em></p>
            
            <a href="https://nearly.com/profile" class="button">Complete Your Profile</a>
            
            <p>Questions? Check our <a href="https://nearly.com/faq">Help Center</a> or email support@nearly.com</p>
            
            <p>Let's get to work!<br>The Nearly Team</p>
          </div>
          
          <div class="footer">
            <p>© 2026 Nearly. All rights reserved.<br>
            <a href="https://nearly.com/privacy">Privacy Policy</a> | <a href="https://nearly.com/faq">Help Center</a></p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Welcome to Nearly!

Hi ${userName},

Welcome to Nearly! We're excited to help you connect with local clients looking for your skills.

Get Started in 3 Steps:
1. Complete Your Profile: Add your bio, skills, portfolio, and pricing
2. Browse Commissions: Find work that matches your expertise
3. Submit Proposals: Send proposals to clients explaining why you're the best fit

Pro Tip: A complete profile with portfolio examples gets 3x more responses!

How You Get Paid:
When a client accepts your proposal, payment is deposited into secure escrow. Complete the work according to your agreed terms and submit it for review. Once the client approves, payment is released to your account.

Remember: You are responsible for delivering work that meets the terms you agreed to with the client. Nearly facilitates payment processing but does not determine when work is complete.

Complete your profile: https://nearly.com/profile

Questions? Help Center: https://nearly.com/faq or email support@nearly.com

Let's get to work!
The Nearly Team`
  }),

  // 3. COMMISSION POSTED CONFIRMATION
  commissionPosted: (userName: string, commissionTitle: string, commissionId: string) => ({
    subject: `Your Commission "${commissionTitle}" is Live! 🎉`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #334155; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #10B981; padding: 30px; text-align: center; border-radius: 12px; margin-bottom: 30px; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .content { background: white; padding: 30px; border-radius: 12px; border: 2px solid #E2E8F0; }
          .button { display: inline-block; background: #0EA5E9; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .footer { text-align: center; color: #94A3B8; font-size: 14px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✓ Commission Posted!</h1>
          </div>
          
          <div class="content">
            <p>Hi ${userName},</p>
            
            <p>Great news! Your commission "<strong>${commissionTitle}</strong>" is now live and visible to independent workers in your area.</p>
            
            <h3>What Happens Next:</h3>
            <ol>
              <li>Independent workers will review your commission and submit proposals</li>
              <li>You'll receive email notifications when proposals arrive</li>
              <li>Review proposals, check portfolios, and select the best fit</li>
              <li>Accept a proposal and payment will be held in secure escrow</li>
            </ol>
            
            <p><strong>Tip:</strong> Review worker profiles carefully. Check their portfolios, reviews from other users, and ask questions before accepting a proposal. You are responsible for vetting and selecting the right worker for your needs.</p>
            
            <a href="https://nearly.com/commission/${commissionId}" class="button">View Your Commission</a>
            
            <p>We'll notify you as soon as proposals start coming in!</p>
            
            <p>Best,<br>The Nearly Team</p>
          </div>
          
          <div class="footer">
            <p>© 2026 Nearly. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Your Commission is Live!

Hi ${userName},

Great news! Your commission "${commissionTitle}" is now live and visible to independent workers in your area.

What Happens Next:
1. Independent workers will review your commission and submit proposals
2. You'll receive email notifications when proposals arrive
3. Review proposals, check portfolios, and select the best fit
4. Accept a proposal and payment will be held in secure escrow

Tip: Review worker profiles carefully. Check their portfolios, reviews from other users, and ask questions before accepting a proposal.

View your commission: https://nearly.com/commission/${commissionId}

Best,
The Nearly Team`
  }),

  // 4. PROPOSAL RECEIVED (to Client)
  proposalReceived: (clientName: string, workerName: string, commissionTitle: string, commissionId: string) => ({
    subject: `New Proposal from ${workerName} for "${commissionTitle}"`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #334155; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .content { background: white; padding: 30px; border-radius: 12px; border: 2px solid #E2E8F0; }
          .button { display: inline-block; background: #0EA5E9; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="content">
            <h2>📩 New Proposal Received</h2>
            
            <p>Hi ${clientName},</p>
            
            <p><strong>${workerName}</strong> has submitted a proposal for your commission "<strong>${commissionTitle}</strong>".</p>
            
            <p><strong>Next Steps:</strong></p>
            <ul>
              <li>Review their proposal, budget, and timeline</li>
              <li>Check their portfolio and reviews from other users</li>
              <li>Message them with any questions</li>
              <li>Accept the proposal if they're the right fit</li>
            </ul>
            
            <p><em>Remember: You are responsible for vetting workers and selecting the best fit. Reviews and ratings are from other users, not Nearly.</em></p>
            
            <a href="https://nearly.com/commission/${commissionId}" class="button">Review Proposal</a>
            
            <p>Best,<br>The Nearly Team</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `New Proposal Received

Hi ${clientName},

${workerName} has submitted a proposal for your commission "${commissionTitle}".

Next Steps:
- Review their proposal, budget, and timeline
- Check their portfolio and reviews from other users
- Message them with any questions
- Accept the proposal if they're the right fit

Remember: You are responsible for vetting workers and selecting the best fit.

Review proposal: https://nearly.com/commission/${commissionId}

Best,
The Nearly Team`
  }),

  // 5. PAYMENT PROCESSED (Escrow Deposited)
  paymentProcessed: (clientName: string, workerName: string, commissionTitle: string, amount: string) => ({
    subject: `Payment Secured in Escrow for "${commissionTitle}"`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #334155; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .content { background: white; padding: 30px; border-radius: 12px; border: 2px solid #E2E8F0; }
          .notice { background: #DBEAFE; border-left: 4px solid #0EA5E9; padding: 15px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="content">
            <h2>🔒 Payment Secured in Escrow</h2>
            
            <p>Hi ${clientName},</p>
            
            <p>Your payment of <strong>${amount}</strong> has been successfully deposited into secure escrow for the commission "<strong>${commissionTitle}</strong>".</p>
            
            <p><strong>What This Means:</strong></p>
            <ul>
              <li>${workerName} has been notified and can begin work</li>
              <li>Your payment is held securely until you approve the submitted work</li>
              <li>Payment will be released per the terms you agreed upon with the worker</li>
            </ul>
            
            <div class="notice">
              <strong>Important:</strong> You are responsible for reviewing the submitted work and determining whether it meets your agreed terms. Nearly holds the funds but does not make decisions about work approval.
            </div>
            
            <p>You'll receive an email when ${workerName} submits the completed work for your review.</p>
            
            <p>Best,<br>The Nearly Team</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Payment Secured in Escrow

Hi ${clientName},

Your payment of ${amount} has been successfully deposited into secure escrow for "${commissionTitle}".

What This Means:
- ${workerName} has been notified and can begin work
- Your payment is held securely until you approve the submitted work
- Payment will be released per the terms you agreed upon with the worker

Important: You are responsible for reviewing the submitted work and determining whether it meets your agreed terms.

You'll receive an email when ${workerName} submits the completed work.

Best,
The Nearly Team`
  }),

  // 6. WORK SUBMITTED (to Client)
  workSubmitted: (clientName: string, workerName: string, commissionTitle: string, commissionId: string) => ({
    subject: `${workerName} Submitted Work for "${commissionTitle}"`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #334155; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .content { background: white; padding: 30px; border-radius: 12px; border: 2px solid #E2E8F0; }
          .button { display: inline-block; background: #0EA5E9; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="content">
            <h2>✅ Work Submitted for Review</h2>
            
            <p>Hi ${clientName},</p>
            
            <p><strong>${workerName}</strong> has submitted their work for the commission "<strong>${commissionTitle}</strong>".</p>
            
            <p><strong>Please Review:</strong></p>
            <ol>
              <li>Check that the work meets the terms you agreed upon</li>
              <li>If satisfied, approve the work to release payment</li>
              <li>If revisions are needed, communicate directly with ${workerName}</li>
            </ol>
            
            <p><em>Payment will be released per your agreed terms once you approve the work.</em></p>
            
            <a href="https://nearly.com/commission/${commissionId}" class="button">Review Submitted Work</a>
            
            <p>Best,<br>The Nearly Team</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Work Submitted for Review

Hi ${clientName},

${workerName} has submitted their work for "${commissionTitle}".

Please Review:
1. Check that the work meets the terms you agreed upon
2. If satisfied, approve the work to release payment
3. If revisions are needed, communicate directly with ${workerName}

Payment will be released per your agreed terms once you approve the work.

Review work: https://nearly.com/commission/${commissionId}

Best,
The Nearly Team`
  }),

  // 7. PAYMENT RELEASED (to Worker)
  paymentReleased: (workerName: string, clientName: string, commissionTitle: string, amount: string) => ({
    subject: `💰 Payment Released for "${commissionTitle}"`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #334155; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #10B981; padding: 30px; text-align: center; border-radius: 12px; margin-bottom: 30px; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .content { background: white; padding: 30px; border-radius: 12px; border: 2px solid #E2E8F0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Payment Released!</h1>
          </div>
          
          <div class="content">
            <p>Hi ${workerName},</p>
            
            <p>Great news! ${clientName} has approved your work and payment of <strong>${amount}</strong> has been released from escrow for the commission "<strong>${commissionTitle}</strong>".</p>
            
            <p><strong>Payment Details:</strong></p>
            <ul>
              <li>Amount: ${amount}</li>
              <li>Processing: 2-3 business days</li>
              <li>Deposit: Bank transfers may take an additional 3-5 business days</li>
            </ul>
            
            <p>Congratulations on completing another commission! Don't forget to leave a review for ${clientName}.</p>
            
            <p>Keep up the great work!<br>The Nearly Team</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Payment Released!

Hi ${workerName},

Great news! ${clientName} has approved your work and payment of ${amount} has been released for "${commissionTitle}".

Payment Details:
- Amount: ${amount}
- Processing: 2-3 business days
- Bank transfers may take an additional 3-5 business days

Congratulations! Don't forget to leave a review for ${clientName}.

Keep up the great work!
The Nearly Team`
  }),

  // 8. DISPUTE NOTIFICATION
  disputeOpened: (userName: string, commissionTitle: string, commissionId: string) => ({
    subject: `Support Request Received for "${commissionTitle}"`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #334155; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .content { background: white; padding: 30px; border-radius: 12px; border: 2px solid #E2E8F0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="content">
            <h2>⚖️ Support Request Received</h2>
            
            <p>Hi ${userName},</p>
            
            <p>We've received your support request regarding the commission "<strong>${commissionTitle}</strong>".</p>
            
            <p><strong>Our Process:</strong></p>
            <ol>
              <li>Our support team will review the evidence and agreed terms</li>
              <li>We'll communicate with both parties to understand the situation</li>
              <li>We'll work to mediate a fair resolution based on your agreement</li>
            </ol>
            
            <p>A support team member will reach out within 1-2 business days. In the meantime, please continue communicating with the other party if possible.</p>
            
            <p><strong>Case ID:</strong> ${commissionId}</p>
            
            <p>Thank you for your patience,<br>The Nearly Support Team</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Support Request Received

Hi ${userName},

We've received your support request regarding "${commissionTitle}".

Our Process:
1. Our support team will review the evidence and agreed terms
2. We'll communicate with both parties to understand the situation
3. We'll work to mediate a fair resolution based on your agreement

A support team member will reach out within 1-2 business days.

Case ID: ${commissionId}

Thank you for your patience,
The Nearly Support Team`
  })
};

// Helper function to send emails (integrate with your email service)
export const sendEmail = async (
  to: string,
  template: { subject: string; html: string; text: string }
) => {
  // TODO: Integrate with SendGrid, AWS SES, or your email service
  console.log('Sending email to:', to);
  console.log('Subject:', template.subject);
  
  // Example SendGrid integration:
  /*
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  
  await sgMail.send({
    to,
    from: 'noreply@nearly.com',
    subject: template.subject,
    html: template.html,
    text: template.text
  });
  */
};