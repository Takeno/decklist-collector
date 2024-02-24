import type {NextApiRequest, NextApiResponse} from 'next';
import nodemailer from 'nodemailer';
import {fetchTournament, supabase} from '../../utils/supabase';

type ResponseData = {token: string} | {message: string};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const tId = req.query.tournament as string;
  const email = req.query.email as string;

  const tournament = await fetchTournament(tId);
  if (tournament === null) {
    return res.status(404).end();
  }

  let transporter = nodemailer.createTransport({
    url: process.env.SMTP,
  });

  await transporter.sendMail({
    from: 'Paupergeddon Winter Edition <decklist@mg.magic-events.gg>',
    subject: 'Your payment is confirmed',
    to: email,
    html: `<!DOCTYPE html>

    <html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">

    <head>
      <title></title>
      <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
      <meta content="width=device-width, initial-scale=1.0" name="viewport" />
      <!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]-->
      <style>
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          padding: 0;
        }

        a[x-apple-data-detectors] {
          color: inherit !important;
          text-decoration: inherit !important;
        }

        #MessageViewBody a {
          color: inherit;
          text-decoration: none;
        }

        p {
          line-height: inherit
        }

        .desktop_hide,
        .desktop_hide table {
          mso-hide: all;
          display: none;
          max-height: 0px;
          overflow: hidden;
        }

        @media (max-width:520px) {
          .desktop_hide table.icons-inner {
            display: inline-block !important;
          }

          .icons-inner {
            text-align: center;
          }

          .icons-inner td {
            margin: 0 auto;
          }

          .row-content {
            width: 100% !important;
          }

          .mobile_hide {
            display: none;
          }

          .stack .column {
            width: 100%;
            display: block;
          }

          .mobile_hide {
            min-height: 0;
            max-height: 0;
            max-width: 0;
            overflow: hidden;
            font-size: 0px;
          }

          .desktop_hide,
          .desktop_hide table {
            display: table !important;
            max-height: none !important;
          }
        }
      </style>
    </head>

    <body style="background-color: #FFFFFF; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
      <table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation"
        style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF;" width="100%">
        <tbody>
          <tr>
            <td>
              <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-1" role="presentation"
                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                <tbody>
                  <tr>
                    <td>
                      <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack"
                        role="presentation"
                        style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 500px;" width="500">
                        <tbody>
                          <tr>
                            <td class="column column-1"
                              style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
                              width="100%">
                              <table border="0" cellpadding="0" cellspacing="0" class="heading_block block-1"
                                role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                <tr>
                                  <td class="pad" style="width:100%;text-align:center;">
                                    <h1
                                      style="margin: 0; color: #555555; font-size: 23px; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; line-height: 120%; text-align: left; direction: ltr; font-weight: 700; letter-spacing: normal; margin-top: 0; margin-bottom: 0;">
                                      Welcome to Paupergeddon Winter Edition!</h1>
                                  </td>
                                </tr>
                              </table>
                              <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-2"
                                role="presentation"
                                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                <tr>
                                  <td class="pad">
                                    <div
                                      style="color:#000000;font-size:14px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-weight:400;line-height:120%;text-align:left;direction:ltr;letter-spacing:0px;mso-line-height-alt:16.8px;">
                                      <p style="margin: 0;">Your payment for <strong>${tournament.name.toUpperCase()}</strong> is confirmed<br /><br />${
      tournament.decklist_required
        ? 'Remember to submit your decklist. You will be able to apply changes until the start of the tournament.'
        : ''
    }</p>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                              <table border="0" cellpadding="10" cellspacing="0" class="button_block block-3"
                                role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                <tr>
                                  <td class="pad">
                                    <div align="center" class="alignment">
                                      <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://paupergeddon-lecco.magic-events.gg" style="height:38px;width:184px;v-text-anchor:middle;" arcsize="11%" stroke="false" fillcolor="#3AAEE0"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#ffffff; font-family:Arial, sans-serif; font-size:14px"><![endif]--><a
                                        href="https://paupergeddon-lecco.magic-events.gg"
                                        style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#3AAEE0;border-radius:4px;width:auto;border-top:1px solid #3AAEE0;font-weight:400;border-right:1px solid #3AAEE0;border-bottom:1px solid #3AAEE0;border-left:1px solid #3AAEE0;padding-top:5px;padding-bottom:5px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;text-align:center;mso-border-alt:none;word-break:keep-all;"
                                        target="_blank"><span
                                          style="padding-left:20px;padding-right:20px;font-size:14px;display:inline-block;letter-spacing:normal;"><span
                                            dir="ltr" style="word-break: break-word; line-height: 28px;">Access to your
                                            account</span></span></a>
                                      <!--[if mso]></center></v:textbox></v:roundrect><![endif]-->
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table><!-- End -->
    </body>

    </html>`,
  });

  res.status(200).end();
}
