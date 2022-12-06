import { OCIntegrationConfig } from "../OCIntegrationConfig";

/**
 * @desc A simple email sender. Intended for "Transactional emails", meaning notifications in response to an action taken in an appplication, like reset password or order submitted. This is as opposed to batches or marketing campaigns.
 */
export interface ISingleEmailSender {
    /**
     * @desc Send a single email, as opposed to a batch of emails or an email campaign. Multiple recipients with personalized templates supported.
     */
    SendSingleEmailAsync(message: EmailMessage, overrideConfig?: OCIntegrationConfig): Promise<null>;
}

/**
 * @desc Email Address
 */
export interface EmailAddress {
    email: string;
    name: string;
}

export interface ToEmailAddress extends EmailAddress  {
    /**
     * @desc Dynamic data specific to this recipient used to populate the template. Overrides values in EmailMessage.GlobalTemplateData. Ignored if AllRecipientsVisibleOnSingleThread is true. Optional.
     */
    TemplateDataOverrides: any;
}

export interface EmailAttachment {
    /**
     * @desc The data for the attached file in Base64Encoded format
     */
    contentBase64Encoded: string;
    /**
     * @desc Multipurpose Internet Mail Extensions type. For example, "text/html", "image/png", ect.
     */
    mimeType: string;
    /**
     * @desc The name of the file to display
     */
    fileName: string
}

/**
 * @desc All the data to send an email. Supports multiple recipients, templatization by recipient, attachments, and either one shared thread or individual messages.
 */
export interface EmailMessage {
    /**
     * @desc Subject line of the email
     */
    subject: string;
    /**
     * @desc Contents of the email. Can be null if the TemplateID property is not null. Will override TemplateID if both are non-null. Assumed to be in HTML format, though a raw string should work.
     */
    content: string;
    /**
     * @desc Reference to an existing email content template in the email automation system. Can be null if the Content property is not null. Will be overriden by Content if both are non-null.
     */
    templateID: string;
    /**
     * @desc From address of the email. 
     */
    fromAddress: EmailAddress;
    /**
     * @desc List of addresses to send the email to.
     */
    toAddresses: ToEmailAddress[];
    /**
     * @desc Dynamic data used to populate the template. Optional.
     */
    globalTemplateData: any;
    /**
     * @desc List of files to attach to the email. Optional.
     */
    attachments: EmailAttachment[];
    /**
     * @desc If true, all recipients will see each other on a single thread and ToEmailAddress.TemplateDataOverrides will do nothing. If false, recipients will recieve personal emails. Defaults to false.
     */
    allRecipientsVisibleOnSingleThread: Boolean;
}