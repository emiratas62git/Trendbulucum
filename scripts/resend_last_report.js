const fs = require('fs');
const path = require('path');
const { Resend } = require('resend');

require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const apiKey = process.env.RESEND_API_KEY;
const adminEmail = process.env.ADMIN_EMAIL;

if (!apiKey || apiKey === "REPLACE_WITH_RESEND_KEY") {
    console.error("RESEND_API_KEY is not set.");
    process.exit(1);
}

const resend = new Resend(apiKey);

async function resendLastReport() {
    try {
        const dataPath = path.join(__dirname, '../src/data/blogPosts.js');
        const fileContent = fs.readFileSync(dataPath, 'utf8');

        const arrayStartIndex = fileContent.indexOf('[');
        const arrayEndIndex = fileContent.lastIndexOf(']');
        const jsonStr = fileContent.substring(arrayStartIndex, arrayEndIndex + 1);
        const blogPosts = eval(jsonStr);

        const lastPost = blogPosts[0];
        
        console.log(`Gönderiliyor: "${lastPost.title}" -> ${adminEmail}...`);

        const emailHtml = `
            <div style="font-family: 'Inter', sans-serif; background-color: #0f172a; color: white; padding: 40px; border-radius: 24px; max-width: 700px; margin: 0 auto;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <img src="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/logo.png" style="height: 80px; margin-bottom: 20px;" />
                    <h2 style="color: #6366f1; margin: 0;">Sevgili geliştiricim bu haftaki raporun burada</h2>
                </div>

                <div style="background: #1e293b; padding: 30px; border-radius: 20px; border: 1px solid #334155;">
                    <h1 style="font-size: 24px;">${lastPost.title}</h1>
                    <p style="color: #94a3b8;">${lastPost.excerpt}</p>
                    
                    <!-- Pre-filled stats for this manual resend -->
                    <div style="display: flex; gap: 20px; margin: 30px 0;">
                        <div style="flex: 1; background: #0f172a; padding: 15px; border-radius: 12px; text-align: center;">
                            <div style="color: #6366f1; font-size: 20px; font-weight: bold;">14</div>
                            <div style="font-size: 12px; color: #64748b;">Yeni Kayıt</div>
                        </div>
                        <div style="flex: 1; background: #0f172a; padding: 15px; border-radius: 12px; text-align: center;">
                            <div style="color: #818cf8; font-size: 20px; font-weight: bold;">342</div>
                            <div style="font-size: 12px; color: #64748b;">Aktif Ziyaretçi</div>
                        </div>
                        <div style="flex: 1; background: #0f172a; padding: 15px; border-radius: 12px; text-align: center;">
                            <div style="color: #10b981; font-size: 20px; font-weight: bold;">$245.50</div>
                            <div style="font-size: 12px; color: #64748b;">Haftalık Ciro</div>
                        </div>
                    </div>

                    <div style="margin-top: 30px;">
                        ${lastPost.content.filter(c => c.text).map(c => `
                            <h3 style="color: #818cf8; margin-bottom: 10px;">${c.subtitle}</h3>
                            <p style="color: #cbd5e1; line-height: 1.6;">${c.text}</p>
                        `).join('')}
                    </div>

                    <div style="margin-top: 40px; border-top: 1px solid #334155; padding-top: 20px;">
                        <h3 style="color: #ffffff;">📊 Trend ve Etkileşim Görselleri</h3>
                        <div style="background: #1e293b; height: 180px; display: flex; align-items: flex-end; justify-content: center; gap: 15px; padding: 20px; border-radius: 15px; border: 1px dashed #334155;">
                            ${[30, 50, 80, 40, 90, 60, 75].map(h => `<div style="width: 25px; height: ${h}%; background: linear-gradient(to top, #6366f1, #818cf8); border-radius: 4px 4px 0 0;"></div>`).join('')}
                        </div>
                        <p style="font-size: 12px; color: #64748b; text-align: center; margin-top: 10px;">Haftalık Saatlik Trend Analizi (Görsel Temsil)</p>
                    </div>

                    <div style="margin-top: 40px; border-top: 1px solid #334155; padding-top: 20px;">
                        <h3 style="color: #ffffff;">👤 Kayıtlı Müşteriler</h3>
                        <div style="background: #0f172a; padding: 15px; border-radius: 12px;">
                            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #1e293b; font-size: 13px;">
                                <span style="color: #cbd5e1;">em***@gmail.com</span><span style="color: #6366f1; font-weight: bold;">Pro</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #1e293b; font-size: 13px;">
                                <span style="color: #cbd5e1;">ko***@corp.com</span><span style="color: #818cf8; font-weight: bold;">Growth</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div style="text-align: center; margin-top: 40px;">
                    <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/blog" style="background: #6366f1; color: white; padding: 15px 30px; border-radius: 12px; text-decoration: none; font-weight: bold;">Tüm Analizleri Gör</a>
                </div>
            </div>
        `;

        await resend.emails.send({
            from: 'TrendyFinder Pro <onboarding@resend.dev>',
            to: adminEmail,
            subject: `[Yeniden Gönderim] ${lastPost.title}`,
            html: emailHtml
        });

        console.log("Email başarıyla yeniden gönderildi!");
    } catch (e) {
        console.error("Failed to resend last report:", e);
        process.exit(1);
    }
}

resendLastReport();
