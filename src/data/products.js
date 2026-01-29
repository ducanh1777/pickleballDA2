import { db } from '../config/firebase';
import {
    collection,
    getDocs,
    getDoc,
    doc,
    addDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy
} from 'firebase/firestore';

const productsRef = collection(db, 'products');


export const getProducts = async () => {
    try {
        const querySnapshot = await getDocs(productsRef);
        const data = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        if (data.length === 0) {
            return products;
        }
        // Manual sort by numeric ID if available
        return data.sort((a, b) => (b.id_numeric || 0) - (a.id_numeric || 0));
    } catch (error) {
        console.error('Error fetching products from Firestore:', error);
        return products;
    }
};

export const getProductById = async (id) => {
    try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            return products.find(p => p.id === parseInt(id));
        }
    } catch (error) {
        console.error('Error fetching product from Firestore:', error);
        return products.find(p => p.id === parseInt(id));
    }
};

export const addProduct = async (productData) => {
    try {
        const docRef = await addDoc(productsRef, {
            ...productData,
            createdAt: new Date().toISOString(),
            id_numeric: Date.now() // Use a different field name to avoid confusion with doc.id
        });
        return docRef.id;
    } catch (error) {
        console.error('Error adding product:', error);
        throw error;
    }
};

export const updateProduct = async (id, productData) => {
    try {
        const docRef = doc(db, 'products', String(id));
        // Use setDoc with merge: true to handle cases where the document might not exist
        // (e.g., if it was a fallback product being saved for the first time)
        await setDoc(docRef, {
            ...productData,
            updatedAt: new Date().toISOString()
        }, { merge: true });
        return true;
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
};

export const deleteProduct = async (id) => {
    try {
        const docRef = doc(db, 'products', id);
        await deleteDoc(docRef);
        return true;
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
};

export const products = [
    // --- Vợt (Paddles) ---
    {
        id: 1,
        // ... (rest of the static data as fallback)
        name: "Selkirk Vanguard Power Air Invikta",
        category: "Vợt (Paddles)",
        brand: "Selkirk",
        price: 6500000,
        image: "https://images.unsplash.com/photo-1626224580175-342426bee7e3?auto=format&fit=crop&q=80&w=800",
        description: "Dòng vợt cao cấp nhất của Selkirk, thiết kế không viền tối ưu khí động học cho sức mạnh bùng nổ."
    },
    {
        id: 2,
        name: "JOOLA Ben Johns Perseus CFS 16",
        category: "Vợt (Paddles)",
        brand: "JOOLA",
        price: 6200000,
        image: "https://images.unsplash.com/photo-1699047970868-8f81077755e1?auto=format&fit=crop&q=80&w=800",
        description: "Vợt chính thức của nhà vô địch số 1 thế giới Ben Johns, mang lại khả năng xoáy đỉnh cao."
    },
    {
        id: 3,
        name: "Gearbox Pro Power Elongated",
        category: "Vợt (Paddles)",
        brand: "Gearbox",
        price: 6800000,
        image: "https://images.unsplash.com/photo-1699047970831-295326466f8e?auto=format&fit=crop&q=80&w=800",
        description: "Công nghệ lõi SST độc quyền, đem lại sức mạnh chưa từng có mà không cần nỗ lực nhiều."
    },
    {
        id: 4,
        name: "Six Zero Sapphire",
        category: "Vợt (Paddles)",
        brand: "Six Zero",
        price: 3500000,
        image: "https://images.unsplash.com/photo-1611250188496-e966043a062f?auto=format&fit=crop&q=80&w=800",
        description: "Dòng vợt hiệu suất cao với mức giá dễ tiếp cận, nổi tiếng với sự bền bỉ và kiểm soát tốt."
    },
    {
        id: 5,
        name: "Kamito Stark Quasars",
        category: "Vợt (Paddles)",
        brand: "Kamito (VN)",
        price: 2450000,
        image: "https://images.unsplash.com/photo-1699047970878-8f81077755e1?auto=format&fit=crop&q=80&w=800",
        description: "Sản phẩm tự hào từ Việt Nam, thiết kế bắt mắt và cân bằng tốt cho người chơi mọi cấp độ."
    },
    {
        id: 6,
        name: "Engage Pursuit MX 6.0",
        category: "Vợt (Paddles)",
        brand: "Engage",
        price: 5800000,
        image: "https://images.unsplash.com/photo-1626224580175-342426bee7e3?auto=format&fit=crop&q=80&w=800",
        description: "Vợt được ưa chuộng bởi người chơi chuyên nghiệp nhờ bề mặt nhám gia tăng độ bám bóng."
    },

    // --- Giày (Shoes) ---
    {
        id: 7,
        name: "Adidas Barricade 13 Pickleball",
        category: "Giày (Shoes)",
        brand: "Adidas",
        price: 3200000,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800",
        description: "Độ ổn định tối đa cho các pha di chuyển ngang liên tục trên sân Pickleball."
    },
    {
        id: 8,
        name: "Nike Court Air Zoom Vapor 11",
        category: "Giày (Shoes)",
        brand: "Nike",
        price: 3800000,
        image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=800",
        description: "Dòng giày tốc độ nhẹ nhất của Nike, giúp bạn phản xạ nhanh hơn tại khu vực Kitchen."
    },
    {
        id: 9,
        name: "Asics Gel-Resolution 9",
        category: "Giày (Shoes)",
        brand: "Asics",
        price: 3500000,
        image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=800",
        description: "Công nghệ đệm GEL huyền thoại giảm chấn thương đầu gối hiệu quả."
    },

    // --- Phụ Kiện (Bags/Accessories) ---
    {
        id: 10,
        name: "Balo Selkirk Dayne Backpack",
        category: "Phụ Kiện (Bags)",
        brand: "Selkirk",
        price: 2500000,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800",
        description: "Balo chuyên dụng có thể đựng được 4 cây vợt, giày và quần áo thi đấu."
    },
    {
        id: 11,
        name: "Túi VNB Premium Series",
        category: "Phụ Kiện (Bags)",
        brand: "VNB (VN)",
        price: 1200000,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800",
        description: "Thiết kế hiện đại, nhiều ngăn tiện lợi cho người chơi lông thủ chuyển sang Pickleball."
    },
    {
        id: 12,
        name: "Bóng JOOLA Primo (Thùng 12 túi)",
        category: "Bóng (Balls)",
        brand: "JOOLA",
        price: 1800000,
        image: "https://images.unsplash.com/photo-1611250188496-e966043a062f?auto=format&fit=crop&q=80&w=800",
        description: "Bóng tiêu chuẩn USAPA, độ nảy ổn định và siêu bền dưới mọi điều kiện thời tiết."
    },

    // --- Thêm Sản Phẩm Mới ---
    {
        id: 13,
        name: "Áo Polo Kamito Pro Fit",
        category: "Quần Áo (Apparel)",
        brand: "Kamito (VN)",
        price: 550000,
        image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=800",
        description: "Chất liệu co giãn 4 chiều, thấm hút mồ hôi cực nhanh."
    },
    {
        id: 14,
        name: "Băng Trán Thấm Mồ Hôi Nike",
        category: "Phụ Kiện (Accessories)",
        brand: "Nike",
        price: 250000,
        image: "https://images.unsplash.com/photo-1516478177764-9fe5bd7e9717?auto=format&fit=crop&q=80&w=800",
        description: "Giúp giữ cho mồ hôi không rơi vào mắt khi bạn tập trung cao độ."
    },
    {
        id: 15,
        name: "Lưới Pickleball Di Động JOOLA",
        category: "Thiết Bị (Equipment)",
        brand: "JOOLA",
        price: 4200000,
        image: "https://images.unsplash.com/photo-1599586120429-48281b6f0ece?auto=format&fit=crop&q=80&w=800",
        description: "Dễ dàng lắp đặt chỉ trong 5 phút, phù hợp cho tập luyện tại nhà hoặc sân chơi công cộng."
    },
    {
        id: 16,
        name: "Vợt CRBN-1X Power Series 14mm",
        category: "Vợt (Paddles)",
        brand: "CRBN",
        price: 6100000,
        image: "https://images.unsplash.com/photo-1626224580175-342426bee7e3?auto=format&fit=crop&q=80&w=800",
        description: "Dòng vợt sợi carbon thô nổi tiếng with độ bám and xoáy cực mạnh."
    },
    {
        id: 17,
        name: "Vợt Vulcan V560 Control",
        category: "Vợt (Paddles)",
        brand: "Vulcan",
        price: 3200000,
        image: "https://images.unsplash.com/photo-1699047970868-8f81077755e1?auto=format&fit=crop&q=80&w=800",
        description: "Thiết kế độ dày lõi lớn giúp tăng khả năng kiểm soát và cảm giác bóng tốt hơn."
    },
    {
        id: 18,
        name: "Giày New Balance Fresh Foam Lav V2",
        category: "Giày (Shoes)",
        brand: "New Balance",
        price: 3600000,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800",
        description: "Lớp đệm Fresh Foam siêu êm ái, bảo vệ gót chân trong những trận đấu dài."
    },
    {
        id: 19,
        name: "Tất Pickleball Chống Trượt Elite",
        category: "Quần Áo (Apparel)",
        brand: "Đức Anh Shop",
        price: 150000,
        image: "https://images.unsplash.com/photo-1582966298433-a2102-ac4846433?auto=format&fit=crop&q=80&w=800",
        description: "Vùng đệm tăng cường lực bám, ngăn chặn vết phồng rộp chân."
    },
    {
        id: 20,
        name: "Băng Cổ Tay Thể Thao Adidas",
        category: "Phụ Kiện (Accessories)",
        brand: "Adidas",
        price: 180000,
        image: "https://images.unsplash.com/photo-1516478177764-9fe5bd7e9717?auto=format&fit=crop&q=80&w=800",
        description: "Thấm hút hiệu quả, phong cách thể thao năng động."
    },
    {
        id: 21,
        name: "Máy Bắn Bóng Pickleball Tutor",
        category: "Thiết Bị (Equipment)",
        brand: "Pickleball Tutor",
        price: 25000000,
        image: "https://images.unsplash.com/photo-1599586120429-48281b6f0ece?auto=format&fit=crop&q=80&w=800",
        description: "Thiết bị tập luyện chuyên nghiệp, có thể thay đổi tốc độ và hướng bắn."
    },
    {
        id: 22,
        name: "Vợt Bread & Butter Filth",
        category: "Vợt (Paddles)",
        brand: "Bread & Butter",
        price: 4200000,
        image: "https://images.unsplash.com/photo-1699047970868-8f81077755e1?auto=format&fit=crop&q=80&w=800",
        description: "Vợt có thiết kế độc đáo, nổi bật trên sân bóng với phong cách đường phố."
    },
    {
        id: 23,
        name: "Vợt Paddletek Bantam TS-5",
        category: "Vợt (Paddles)",
        brand: "Paddletek",
        price: 3900000,
        image: "https://images.unsplash.com/photo-1626224580175-342426bee7e3?auto=format&fit=crop&q=80&w=800",
        description: "Dòng vợt nhẹ nhất của Paddletek, dành cho những người chơi thích sự linh hoạt."
    },
    {
        id: 24,
        name: "Cuộn Cán Vợt Gan (Vỉ 6 cái)",
        category: "Phụ Kiện (Accessories)",
        brand: "Gan",
        price: 350000,
        image: "https://images.unsplash.com/photo-1626224580175-342426bee7e3?auto=format&fit=crop&q=80&w=800",
        description: "Độ bền cực cao, giữ cho tay luôn khô ráo."
    },
    {
        id: 25,
        name: "Váy Tennis/Pickleball Lululemon",
        category: "Quần Áo (Apparel)",
        brand: "Lululemon",
        price: 2800000,
        image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=800",
        description: "Phong cách sang trọng cùng chất liệu vải Nulu cao cấp."
    },
    {
        id: 26,
        name: "Áo Tanktop Nike Court",
        category: "Quần Áo (Apparel)",
        brand: "Nike",
        price: 1100000,
        image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=800",
        description: "Công nghệ Dri-FIT giúp vận động viên luôn mát mẻ."
    },
    {
        id: 27,
        name: "Túi Đựng 2 Vợt Selkirk SLK",
        category: "Phụ Kiện (Bags)",
        brand: "SLK by Selkirk",
        price: 950000,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800",
        description: "Nhỏ gọn, bảo vệ bề mặt vợt khỏi trầy xước."
    },
    {
        id: 28,
        name: "Vợt Diadem Warrior Edge",
        category: "Vợt (Paddles)",
        brand: "Diadem",
        price: 4900000,
        image: "https://images.unsplash.com/photo-1699047970868-8f81077755e1?auto=format&fit=crop&q=80&w=800",
        description: "Công nghệ lõi tổ ong 19mm cho sự kiểm soát tuyệt đối."
    },
    {
        id: 30,
        name: "Dung Dịch Vệ Sinh Vợt Pro",
        category: "Phụ Kiện (Accessories)",
        brand: "Đức Anh Shop",
        price: 220000,
        image: "https://images.unsplash.com/photo-1589365278144-c9e705f843ba?auto=format&fit=crop&q=80&w=800",
        description: "Giữ bề mặt nhám của vợt luôn sạch sẽ và tối ưu độ xoáy."
    }
];
