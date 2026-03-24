const { db } = require('../config/firebase');

exports.getConversations = async (req, res) => {
    try {
        const snaps1 = await db.collection('conversations').where('participants', 'array-contains', req.user.uid).get();

        const conversations = await Promise.all(snaps1.docs.map(async doc => {
            const c = doc.data();

            // Resolve participant data
            c.participantsData = await Promise.all(c.participants.map(async (uid) => {
                const uDoc = await db.collection('users').doc(uid).get();
                if (uDoc.exists) return { _id: uDoc.id, name: uDoc.data().name, profileImage: uDoc.data().profileImage };
                return { _id: uid };
            }));

            return { _id: doc.id, ...c, participants: c.participantsData };
        }));

        // Sort by updatedAt desc
        conversations.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

        res.status(200).json({ success: true, count: conversations.length, data: conversations });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

exports.getMessages = async (req, res) => {
    try {
        const { id } = req.params;
        const cDoc = await db.collection('conversations').doc(id).get();

        if (!cDoc.exists || !cDoc.data().participants.includes(req.user.uid)) {
            return res.status(403).json({ success: false, error: 'Not authorized' });
        }

        const mSnaps = await db.collection('messages').where('conversationId', '==', id).orderBy('createdAt', 'asc').get();
        const messages = mSnaps.docs.map(d => ({ _id: d.id, ...d.data() }));

        res.status(200).json({ success: true, data: messages });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

exports.sendMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;

        const cRef = db.collection('conversations').doc(id);
        const cDoc = await cRef.get();

        if (!cDoc.exists || !cDoc.data().participants.includes(req.user.uid)) {
            return res.status(403).json({ success: false, error: 'Not authorized' });
        }

        const msg = {
            conversationId: id,
            sender: req.user.uid,
            text,
            createdAt: new Date().toISOString()
        };
        const mRef = await db.collection('messages').add(msg);

        await cRef.update({
            lastMessage: text,
            updatedAt: new Date().toISOString()
        });

        res.status(201).json({ success: true, data: { _id: mRef.id, ...msg } });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

exports.startConversation = async (req, res) => {
    try {
        const { merchantId, bookingId } = req.body;

        const snaps = await db.collection('conversations')
            .where('participants', 'array-contains', req.user.uid)
            .get();

        let existing;
        snaps.forEach(doc => {
            const d = doc.data();
            if (d.participants.includes(merchantId) && d.booking === bookingId) existing = { _id: doc.id, ...d };
        });

        if (existing) {
            return res.status(200).json({ success: true, data: existing });
        }

        const newConvo = {
            participants: [req.user.uid, merchantId],
            booking: bookingId,
            lastMessage: '',
            updatedAt: new Date().toISOString()
        };
        const ref = await db.collection('conversations').add(newConvo);

        res.status(201).json({ success: true, data: { _id: ref.id, ...newConvo } });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
