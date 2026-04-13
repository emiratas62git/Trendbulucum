import { prisma } from './prisma';

// Common disposable email domains
const DISPOSABLE_DOMAINS = [
    'temp-mail.org', 'guerrillamail.com', '10minutemail.com', 'mailinator.com',
    'trashmail.com', 'getnada.com', 'dispostable.com', 'yopmail.com',
    'sharklasers.com', 'guerrillamail.biz', 'guerrillamail.de', 'guerrillamail.net',
    'guerrillamail.org', 'guerrillamailblock.com', 'pokemail.net', 'spam4.me'
];

/**
 * Checks if an email is from a disposable provider
 */
export function isDisposableEmail(email) {
    if (!email) return false;
    const domain = email.split('@')[1]?.toLowerCase();
    return DISPOSABLE_DOMAINS.includes(domain);
}

/**
 * Checks if an IP has exceeded the registration limit (max 2 per 24 hours)
 */
export async function checkRegistrationLimit(ipAddress) {
    if (!ipAddress || ipAddress === '127.0.0.1' || ipAddress === '::1') return true;

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const registrationCount = await prisma.user.count({
        where: {
            lastIp: ipAddress,
            createdAt: {
                gte: twentyFourHoursAgo
            }
        }
    });

    return registrationCount < 2; // User's approved limit: max 2
}

/**
 * Logs a sensitive action for auditing
 */
export async function logAudit(userId, action, ipAddress, details = '') {
    try {
        await prisma.auditLog.create({
            data: {
                userId,
                action,
                ipAddress,
                details: typeof details === 'object' ? JSON.stringify(details) : details
            }
        });
    } catch (e) {
        console.error("Failed to log audit action:", e);
    }
}
