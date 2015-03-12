module.exports = {
  friendlyName: 'Send email',
  description: 'Send an email',
  extendedDescription: '',
  inputs: {
    apiUser: {
      description: 'The API user of the Sendgrid account to use.',
      example: 'someuser',
      required: true,
      whereToGet: {
        url: 'https://sendgrid.com/credentials/new',
        description: 'Use the username you used while creating your SendGrid Account or one of the custom credentials.',
        extendedDescription: 'Your API user is the same string as the password that you use to log onto sendgrid.com. You can also create auxiliary sets of API credentials following this link: https://sendgrid.com/credentials.'
      }
    },
    apiKey: {
      description: 'The API key of the Sendgrid account to use.',
      example: 'whateverkey',
      required: true,
      whereToGet: {
        url: 'https://sendgrid.com/credentials/new',
        description: 'The key is the password of your main SendGrid account, or the one corresponding to the custom credential',
        extendedDescription: 'Your API key is the same string as the password that you use to log onto sendgrid.com. You can also create auxiliary sets of API credentials following this link: https://sendgrid.com/credentials.'
      }
    },
    toEmail: {
      example: 'jane@example.com',
      description: 'Must be a valid email address. This can also be passed in as an array, to send to multiple locations. Example: to[]=a@mail.com[]=b@mail.com. Note that recipients passed in this parameter will be visible as part of the message.',
      required: true
    },
    toName: {
      example: 'Jane Doe',
      description: 'Must be a string. If to parameter is an array, toname must be an array with the exact number of array elements as the to field',
      extendedDescription: 'If left blank, defaults to the recipient\'s email address.'
    },
    subject: {
      description: 'Subject line for the email.',
      example: 'Welcome, Jane!',
      required: true
    },
    textMessage: {
      description: 'The plain text content of the body body of the email. It must include at least one of the textMessage or htmlMessage parameters.',
      example: 'Jane,\nThanks for joining our community.  If you have any questions, please don\'t hesitate to send them our way.  Feel free to reply to this email directly.\n\nSincerely,\nThe Management',
      required: true
    },
    htmlMessage: {
      description: 'The plain text content of the body body of the email. It must include at least one of the textMessage or htmlMessage parameters.',
      example: 'Jane,\nThanks for joining our community.  If you have any questions, please don\'t hesitate to send them our way.  Feel free to reply to this email directly.\n\nSincerely,\nThe Management'
    },
    fromEmail: {
      description: 'Must be a valid email address from your domain	This is where the email will appear to originate from for your recipient',
      example: 'harold@example.enterprise',
      required: true
    },
    fromName: {
      description: 'Must a valid string. It is the name appended to the from email field. IE - Your name or company name',
      example: 'Harold Greaseworthy'
    },
    replyTo: {
      description: 'Must a valid email address. This is the email that will be used when replying to your email',
      example: 'support@example.com'
    }
  },
  defaultExit: 'success',
  exits: {
    error: {
      description: 'Unexpected error occurred.'
    },
    success: {
      example: '{"message":"success"}',
      description: 'Returns a JSON object with the result',
      variableName: 'sendMailResult'
    }
  },
  fn: function(inputs, exits) {

    var sendgrid = require('sendgrid')(inputs.apiUser, inputs.apiKey);

    var email = new sendgrid.Email({
      to: inputs.toEmail,
      subject: inputs.subject,
      text: inputs.textMessage
    });
    if (inputs.toName) {
      email.toname = inputs.toName;
    }
    if (inputs.fromEmail) {
      email.from = inputs.fromEmail;
    }
    if (inputs.fromName) {
      email.fromname = inputs.fromName;
    }
    if (inputs.htmlMessage) {
      email.html = inputs.htmlMessage;
    }

    sendgrid.send(email, function(err, json) {
      console.log(err);
      if (err) {
        return exits.error(err);
      }
      return exits.success(json);
    });
  }
};