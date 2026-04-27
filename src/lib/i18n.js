const translations = {
    en: {
        upgradePro: "Upgrade to Pro Now",
        unlimitedPro: "Unlimited Pro",
        daysLeft: "Days Left",
        accountSettings: "Account Settings",
        profileDescription: "You can update your personal information here.",
        fullName: "Full Name",
        emailAddress: "Email Address",
        subscriptionStatus: "Subscription Status",
        membershipType: "Membership Type",
        premiumPlan: "Premium Plan",
        freePlan: "Free Plan",
        expiryDate: "Expiry Date",
        unlimited: "Unlimited",
        none: "None",
        profileSuccess: "Profile updated successfully!",
        saveChanges: "Save Changes",
        updating: "Updating...",
        backToDashboard: "Back to Dashboard",
        personalInfo: "Personal Information"
    },
    tr: {
        upgradePro: "Şimdi Pro'ya Geç",
        unlimitedPro: "Süresiz Pro",
        daysLeft: "Gün Kaldı",
        accountSettings: "Hesap Ayarları",
        profileDescription: "Kişisel bilgilerinizi buradan güncelleyebilirsiniz.",
        fullName: "Ad Soyad",
        emailAddress: "E-posta Adresi",
        subscriptionStatus: "Abonelik Durumu",
        membershipType: "Üyelik Tipi",
        premiumPlan: "Premium Plan",
        freePlan: "Ücretsiz Plan",
        expiryDate: "Bitiş Tarihi",
        unlimited: "Süresiz",
        none: "Yok",
        profileSuccess: "Profil başarıyla güncellendi!",
        saveChanges: "Değişiklikleri Kaydet",
        updating: "Güncelleniyor...",
        backToDashboard: "Panele Dön",
        personalInfo: "Kişisel Bilgiler"
    }
};

export const getTranslation = (lang) => {
    const defaultLang = 'en';
    const supportedLangs = ['en', 'tr'];
    const shortLang = lang ? lang.split('-')[0].toLowerCase() : defaultLang;
    
    return translations[supportedLangs.includes(shortLang) ? shortLang : defaultLang];
};
