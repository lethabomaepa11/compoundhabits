
import { MJ_APIKEY_PRIVATE, MJ_APIKEY_PUBLIC } from '$env/static/private'
import Mailjet from 'node-mailjet'
import { Mail, MailUser } from '../types/models';


//initialize mailjet client
const mailjet = Mailjet.apiConnect(
  MJ_APIKEY_PUBLIC!,
  MJ_APIKEY_PRIVATE!
);


//the main function to be called
export function sendEmail(user : MailUser, mail: Mail) {
    request(new MailUser('noreply@titanisys.co.za', 'Titanisys'), user, mail)
		.then((result) => {
			return result.body;
		})
		.catch((err) => {
			return err;
		})
}




function request(from: MailUser, to: MailUser, mail: Mail) {
	return mailjet
		.post('send', { version: 'v3.1' })
	.request({
		Messages: [
			{
				From: {
					Email: from.email,
					Name:from.name
				},
				To: [
					{
						Email: to.email,
						Name: to.email
					}
				],
				Subject: mail.subject,
				TextPart: mail.textPart,
				HTMLPart: mail.htmlPart
			}
		]
	})

}