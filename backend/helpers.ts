import { prisma } from "./db";

export async function generateTitleFromMessage(message: string): Promise<string> {
    const STOP_WORDS = new Set([
        "a", "an", "the", "is", "are", "was", "were", "be", "been",
        "do", "does", "did", "will", "would", "could", "should", "can",
        "i", "me", "my", "we", "you", "it", "in", "on", "at", "to",
        "for", "of", "and", "or", "but", "what", "how", "why", "when",
        "where", "who", "which", "that", "this", "please", "tell",
    ]);

    const cleaned = message
        .replace(/[^\w\s]/g, " ")   // strip punctuation
        .replace(/\s+/g, " ")
        .trim();

    const words = cleaned.split(" ");

    // Capitalize first word always, then pick meaningful words
    const titleWords: string[] = [];
    for (const word of words) {
        if (titleWords.length === 0 || !STOP_WORDS.has(word.toLowerCase())) {
            titleWords.push(
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            );
        }
        if (titleWords.length === 6) break;
    }

    // Fallback: just truncate if nothing meaningful found
    if (titleWords.length < 2) {
        return cleaned.slice(0, 50) + (cleaned.length > 50 ? "..." : "");
    }

    return titleWords.join(" ");
}

// Usage:
// "what is the difference between sql and nosql databases?"
// → "What Difference Between SQL NoSQL Databases"

export async function getUniqueSlug(title: string): Promise<string> {

    const baseSlug = title.split(" ").join("-");

    const similar = await prisma.conversation.findMany({
        where: { slug: { startsWith: baseSlug } },
        select: { slug: true },
    })

    if (similar.length === 0) return baseSlug;

    const existingSlugs = new Set(similar.map((c) => c.slug));

    if (!existingSlugs.has(baseSlug)) return baseSlug;

    let suffix = 1;
    while (existingSlugs.has(`${baseSlug}-${suffix}`)) suffix++;

    return `${baseSlug}-${suffix}`;
}

export async function createConversation(query: string, userId: string) {

    const title = await generateTitleFromMessage(query);
    const slug = await getUniqueSlug(title);

    const conversation = await prisma.conversation.create({
        data: {
            userId: userId,
            title: title,
            slug: slug,
        },
        include: {
            messages: true
        }
    })

    return conversation
}