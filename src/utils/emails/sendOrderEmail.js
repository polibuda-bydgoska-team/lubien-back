const transporter = require("../../config/emailTransporter");
const clientURI = process.env.CLIENT_URI || "http://localhost:3000";
const ejs = require("ejs");

const sendOrderEmail = (
  userEmail,
  userName,
  orderId,
  totalPrice,
  items,
  shippingCost
) => {
  const htmlBody = ejs.render(
    `<!doctype html>
  <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
      <title>
        
      </title>
      <!--[if !mso]><!-- -->
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <!--<![endif]-->
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style type="text/css">
        #outlook a { padding:0; }
        body { margin:0;padding:0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%; }
        table, td { border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt; }
        img { border:0;height:auto;line-height:100%; outline:none;text-decoration:none;-ms-interpolation-mode:bicubic; }
        p { display:block;margin:13px 0; }
      </style>
      <!--[if mso]>
      <xml>
      <o:OfficeDocumentSettings>
        <o:AllowPNG/>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
      </xml>
      <![endif]-->
      <!--[if lte mso 11]>
      <style type="text/css">
        .outlook-group-fix { width:100% !important; }
      </style>
      <![endif]-->
      
    <!--[if !mso]><!-->
      <link href="https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700" rel="stylesheet" type="text/css">
<link href="https://fonts.googleapis.com/css?family=Cabin:400,700" rel="stylesheet" type="text/css">
      <style type="text/css">
        @import url(https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700);
@import url(https://fonts.googleapis.com/css?family=Cabin:400,700);
      </style>
    <!--<![endif]-->

  
      
  <style type="text/css">
    @media only screen and (min-width:480px) {
      .mj-column-per-100 { width:100% !important; max-width: 100%; }
.mj-column-per-50 { width:50% !important; max-width: 50%; }
.mj-column-per-33 { width:33.333333% !important; max-width: 33.333333%; }
    }
  </style>
  

      <style type="text/css">
      
      

  @media only screen and (max-width:480px) {
    table.full-width-mobile { width: 100% !important; }
    td.full-width-mobile { width: auto !important; }
  }

      </style>
      <style type="text/css">.hide_on_mobile { display: none !important;} 
      @media only screen and (min-width: 480px) { .hide_on_mobile { display: block !important;} }
      .hide_section_on_mobile { display: none !important;} 
      @media only screen and (min-width: 480px) { 
          .hide_section_on_mobile { 
              display: table !important;
          } 

          div.hide_section_on_mobile { 
              display: block !important;
          }
      }
      .hide_on_desktop { display: block !important;} 
      @media only screen and (min-width: 480px) { .hide_on_desktop { display: none !important;} }
      .hide_section_on_desktop { display: table !important;} 
      @media only screen and (min-width: 480px) { .hide_section_on_desktop { display: none !important;} }
      [owa] .mj-column-per-100 {
          width: 100%!important;
        }
        [owa] .mj-column-per-50 {
          width: 50%!important;
        }
        [owa] .mj-column-per-33 {
          width: 33.333333333333336%!important;
        }
        p, h1, h2, h3 {
            margin: 0px;
        }

        a {
            text-decoration: none;
            color: inherit;
        }
      
        @media only print and (min-width:480px) {
          .mj-column-per-100 { width:100%!important; }
          .mj-column-per-40 { width:40%!important; }
          .mj-column-per-60 { width:60%!important; }
          .mj-column-per-50 { width: 50%!important; }
          mj-column-per-33 { width: 33.333333333333336%!important; }
          }</style>
      
    </head>
    <body style="background-color:#FFFFFF;">
      
      
    <div style="background-color:#FFFFFF;">
      
    
    <!--[if mso | IE]>
    <table
       align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
    >
      <tr>
        <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
    <![endif]-->
  
    
    <div style="margin:0px auto;max-width:600px;">
      
      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
        <tbody>
          <tr>
            <td style="direction:ltr;font-size:0px;padding:9px 0px 9px 0px;text-align:center;">
              <!--[if mso | IE]>
                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
              
      <tr>
    
          <td
             class="" style="vertical-align:top;width:600px;"
          >
        <![endif]-->
          
    <div class="mj-column-per-100 outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
      
    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
      
          <tr>
            <td align="center" style="font-size:0px;padding:0px 0px 5px 0px;word-break:break-word;">
              
    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
      <tbody>
        <tr>
          <td style="width:390px;">
            
    <img height="auto" src="https://s3-eu-west-1.amazonaws.com/topolio/uploads/60a291526a905/1621266804.jpg" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="390">
  
          </td>
        </tr>
      </tbody>
    </table>
  
            </td>
          </tr>
        
          <tr>
            <td align="left" style="font-size:0px;padding:25px 15px 0px 15px;word-break:break-word;">
              
    <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:11px;line-height:1.5;text-align:left;color:#000000;"><p><span style="font-family: Cabin, sans-serif; font-size: 17px;">Hey ${userName},</span></p></div>
  
            </td>
          </tr>
        
          <tr>
            <td align="left" style="font-size:0px;padding:5px 15px 10px 15px;word-break:break-word;">
              
    <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:11px;line-height:1.5;text-align:left;color:#000000;"><h1 style="font-family: 'Cabin', sans-serif;"><span style="font-size: 30px;">Thanks for your order!</span></h1></div>
  
            </td>
          </tr>
        
          <tr>
            <td align="left" style="font-size:0px;padding:10px 15px 10px 15px;word-break:break-word;">
              
    <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:11px;line-height:1.5;text-align:left;color:#000000;"><h2><span style="font-family: Cabin, sans-serif;">Order: ${orderId}</span></h2></div>
  
            </td>
          </tr>
        
          <tr>
            <td style="font-size:0px;word-break:break-word;">
              
    
  <!--[if mso | IE]>
  
      <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td height="50" style="vertical-align:top;height:50px;">
    
  <![endif]-->

    <div style="height:50px;">
      &nbsp;
    </div>
    
  <!--[if mso | IE]>
  
      </td></tr></table>
    
  <![endif]-->

  
            </td>
          </tr>
        
    </table>
  
    </div>
  
        <!--[if mso | IE]>
          </td>
        
      </tr>
    
                </table>
              <![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
      
    </div>
  
    
    <!--[if mso | IE]>
        </td>
      </tr>
    </table>
    
    <table
       align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
    >
      <tr>
        <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
    <![endif]-->
  
    
    <div style="margin:0px auto;max-width:600px;">
      
      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
        <tbody>
          <tr>
            <td style="direction:ltr;font-size:0px;padding:9px 0px 9px 0px;text-align:center;">
              <!--[if mso | IE]>
                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
              
      <tr>
    
          <td
             class="" style="vertical-align:top;width:300px;"
          >
        <![endif]-->
          
    <div class="mj-column-per-50 outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
      
    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
      
          <tr>
            <td align="left" style="font-size:0px;padding:15px 15px 0px 15px;word-break:break-word;">
              
    <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:11px;line-height:1.5;text-align:left;color:#000000;"><p style="text-align: left;"><span style="font-family: Cabin, sans-serif; font-size: 19px;">Your Items</span></p></div>
  
            </td>
          </tr>
        
    </table>
  
    </div>
  
        <!--[if mso | IE]>
          </td>
        
          <td
             class="" style="vertical-align:top;width:300px;"
          >
        <![endif]-->
          
    <div class="mj-column-per-50 outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
      
    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
      
          <tr>
            <td align="left" style="font-size:0px;padding:15px 15px 0px 15px;word-break:break-word;">
              
    <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:11px;line-height:1.5;text-align:left;color:#000000;"><p style="text-align: right;"><strong><span style="font-family: Cabin, sans-serif; font-size: 19px;">Total: £${totalPrice} (shipping: £${shippingCost})</span></strong></p></div>
  
            </td>
          </tr>
        
    </table>
  
    </div>
  
        <!--[if mso | IE]>
          </td>
        
      </tr>
    
                </table>
              <![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
      
    </div>
  
    
    <!--[if mso | IE]>
        </td>
      </tr>
    </table>
    
    <table
       align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
    >
      <tr>
        <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
    <![endif]-->
  
    
    <div style="margin:0px auto;max-width:600px;">
      
      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
        <tbody>
          <tr>
            <td style="direction:ltr;font-size:0px;padding:9px 0px 9px 0px;text-align:center;">
              <!--[if mso | IE]>
                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
              
      <tr>
    
          <td
             class="" style="vertical-align:top;width:600px;"
          >
        <![endif]-->
          
    <div class="mj-column-per-100 outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
      
    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
      
          <tr>
            <td style="font-size:0px;padding:10px 10px;padding-top:10px;padding-right:10px;padding-bottom:10px;word-break:break-word;">
              
    <p style="border-top:solid 3px #000000;font-size:1;margin:0px auto;width:100%;">
    </p>

    <% items.forEach(i => { %>
    
    <!--[if mso | IE]>
      <table
         align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 3px #000000;font-size:1;margin:0px auto;width:580px;" role="presentation" width="580px"
      >
        <tr>
          <td style="height:0;line-height:0;">
            &nbsp;
          </td>
        </tr>
      </table>
    <![endif]-->
  
  
            </td>
          </tr>
        
    </table>
  
    </div>
  
        <!--[if mso | IE]>
          </td>
        
      </tr>
    
                </table>
              <![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
      
    </div>
  
    
    <!--[if mso | IE]>
        </td>
      </tr>
    </table>
    
    <table
       align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
    >
      <tr>
        <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
    <![endif]-->
  
    
    <div style="margin:0px auto;max-width:600px;">
      
      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
        <tbody>
          <tr>
            <td style="direction:ltr;font-size:0px;padding:9px 0px 9px 0px;text-align:center;">
              <!--[if mso | IE]>
                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
              
      <tr>
    
          <td
             class="" style="vertical-align:top;width:199.999998px;"
          >
        <![endif]-->
          
    <div class="mj-column-per-33 outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
    
    
    
    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
      
          <tr>
            <td align="left" style="font-size:0px;padding:5px 15px 5px 15px;word-break:break-word;">
              
    <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:11px;line-height:1.5;text-align:left;color:#000000;"><p style="text-align: left;"><span style="font-family: Cabin, sans-serif; font-size: 15px;"><%= i.title %></span></p></div>
  
            </td>
          </tr>
        
    </table>
  
    </div>
  
        <!--[if mso | IE]>
          </td>
        
          <td
             class="" style="vertical-align:top;width:199.999998px;"
          >
        <![endif]-->
          
    <div class="mj-column-per-33 outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
      
    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
      
          <tr>
            <td align="left" style="font-size:0px;padding:5px 15px 5px 15px;word-break:break-word;">
              
    <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:11px;line-height:1.5;text-align:left;color:#000000;"><p style="text-align: right;"><span style="font-family: Cabin, sans-serif; font-size: 15px;">x<%= i.quantity %></span></p></div>
  
            </td>
          </tr>
        
    </table>
  
    </div>
  
        <!--[if mso | IE]>
          </td>
        
          <td
             class="" style="vertical-align:top;width:199.999998px;"
          >
        <![endif]-->
          
    <div class="mj-column-per-33 outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
      
    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
      
          <tr>
            <td align="left" style="font-size:0px;padding:5px 15px 5px 15px;word-break:break-word;">
              
    <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:11px;line-height:1.5;text-align:left;color:#000000;"><p style="text-align: right;"><span style="font-family: Cabin, sans-serif; font-size: 15px;">£<%= i.price %></span></p></div>
  
            </td>
          </tr>
        
    </table>
  
    </div>
  
        <!--[if mso | IE]>
          </td>
        
      </tr>
    
                </table>
              <![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
      
    </div>
  
    
    <!--[if mso | IE]>
        </td>
      </tr>
    </table>
    
    <table
       align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
    >
      <tr>
        <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
    <![endif]-->
  
    
    <div style="margin:0px auto;max-width:600px;">
      
      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
        <tbody>
          <tr>
            <td style="direction:ltr;font-size:0px;padding:0px 0px 0px 0px;text-align:center;">
              <!--[if mso | IE]>
                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
              
      <tr>
    
          <td
             class="" style="vertical-align:top;width:600px;"
          >
        <![endif]-->
          
    <div class="mj-column-per-100 outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
      
    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
      
          <tr>
            <td style="font-size:0px;padding:10px 10px;padding-top:10px;padding-right:10px;word-break:break-word;">
              
    <p style="border-top:solid 1px #000000;font-size:1;margin:0px auto;width:100%;">
    </p>
    
    <!--[if mso | IE]>
      <table
         align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 1px #000000;font-size:1;margin:0px auto;width:580px;" role="presentation" width="580px"
      >
        <tr>
          <td style="height:0;line-height:0;">
            &nbsp;
          </td>
        </tr>
      </table>
    <![endif]-->
  
  
            </td>
          </tr>
        
          <tr>
            <td style="font-size:0px;word-break:break-word;">
              
    
  <!--[if mso | IE]>
  
      <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td height="30" style="vertical-align:top;height:30px;">
    
  <![endif]-->

    <div style="height:30px;">
      &nbsp;
    </div>
    
  <!--[if mso | IE]>
  
      </td></tr></table>
    
  <![endif]-->
  
            </td>
          </tr>
        
          <tr>
            <td align="center" vertical-align="middle" style="font-size:0px;padding:0px 20px 10px 20px;word-break:break-word;">


            <% }); %>

    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;width:100%;line-height:100%;">
      <tr>
        <td align="center" bgcolor="#007EFF" role="presentation" style="border:0px solid #000;border-radius:24px;cursor:auto;mso-padding-alt:9px 26px 9px 26px;background:#007EFF;" valign="middle">
          <a href="${clientURI}/my-account" style="display: inline-block; background: #007EFF; color: #ffffff; font-family: Ubuntu, Helvetica, Arial, sans-serif, Helvetica, Arial, sans-serif; font-size: 14px; font-weight: normal; line-height: 17.5px; margin: 0; text-decoration: none; text-transform: none; padding: 9px 26px 9px 26px; mso-padding-alt: 0px; border-radius: 24px;" target="_blank">
            <span style="font-family: Cabin, sans-serif; font-size: 14px;">Your Orders</span>
          </a>
        </td>
      </tr>
    </table>
  
            </td>
          </tr>
        
    </table>
  
    </div>
  
        <!--[if mso | IE]>
          </td>
        
      </tr>
    
                </table>
              <![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
      
    </div>
  
    
    <!--[if mso | IE]>
        </td>
      </tr>
    </table>
    
    <table
       align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
    >
      <tr>
        <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
    <![endif]-->
  
    
    <div style="margin:0px auto;max-width:600px;">
      
      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
        <tbody>
          <tr>
            <td style="direction:ltr;font-size:0px;padding:9px 0px 9px 0px;text-align:center;">
              <!--[if mso | IE]>
                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
              
      <tr>
    
          <td
             class="" style="vertical-align:top;width:300px;"
          >
        <![endif]-->
          
    <div class="mj-column-per-50 outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
      
    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
      
          <tr>
            <td align="left" style="font-size:0px;padding:15px 5px 15px 15px;word-break:break-word;">
              
    <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:11px;line-height:1.5;text-align:left;color:#000000;"><p style="text-align: right;"><span style="font-family: Cabin, sans-serif; font-size: 13px;">Lubien</span><br><span style="font-family: Cabin, sans-serif; font-size: 13px;">You-time reinvented</span></p></div>
  
            </td>
          </tr>
        
    </table>
  
    </div>
  
        <!--[if mso | IE]>
          </td>
        
          <td
             class="" style="vertical-align:top;width:300px;"
          >
        <![endif]-->
          
    <div class="mj-column-per-50 outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
      
    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
      
          <tr>
            <td align="left" style="font-size:0px;padding:13px 10px 10px 5px;word-break:break-word;">
              
    
   <!--[if mso | IE]>
    <table
       align="left" border="0" cellpadding="0" cellspacing="0" role="presentation"
    >
      <tr>
    
            <td>
          <![endif]-->
            <table align="left" border="0" cellpadding="0" cellspacing="0" role="presentation" style="float:none;display:inline-table;">
              
    <tr>
      <td style="padding:4px;">
        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:transparent;border-radius:3px;width:35px;">
          <tr>
            <td style="font-size:0;height:35px;vertical-align:middle;width:35px;">
              <a href="https://www.instagram.com/lubien.candles/" target="_blank" style="color: #0000EE;">
                  <img alt="instagram" height="35" src="https://s3-eu-west-1.amazonaws.com/ecomail-assets/editor/social-icos/ikony-black/outlinedblack/instagram.png" style="border-radius:3px;display:block;" width="35">
                </a>
              </td>
            </tr>
        </table>
      </td>
      
    </tr>
  
            </table>
          <!--[if mso | IE]>
            </td>
          
        </tr>
      </table>
    <![endif]-->
  
  
            </td>
          </tr>
        
    </table>
  
    </div>
  
        <!--[if mso | IE]>
          </td>
        
      </tr>
    
                </table>
              <![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
      
    </div>
  
    
    <!--[if mso | IE]>
        </td>
      </tr>
    </table>
    <![endif]-->
  
  
    </div>
  
    </body>
  </html>`,
    { items: items }
  );

  transporter.sendMail({
    to: userEmail,
    from: "adibu8@gmail.com",
    subject: "Order confirmation",
    html: htmlBody,
  });
};

module.exports = sendOrderEmail;
