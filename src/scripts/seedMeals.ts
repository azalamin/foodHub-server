import { DietaryType } from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";

async function main() {
	console.log("Cleaning existing meals...");
	await prisma.meal.deleteMany();

	console.log("Fetching real IDs from database...");
	const providers = await prisma.providerProfile.findMany({ include: { user: true } });
	const categories = await prisma.category.findMany();

	const getPId = (name: string) => providers.find(p => p.user.name === name)?.id;
	const getCId = (name: string) => categories.find(c => c.name === name)?.id;

	const rawData = [
		// DESI / RICE DISHES
		{
			name: "Mutton Kacchi Biryani",
			price: 480,
			provider: "Sultan's Dine",
			cat: "Rice Dishes",
			diet: DietaryType.HALAL,
			img: "https://images.unsplash.com/photo-1589302168068-964664d93dc0",
		},
		{
			name: "Beef Tehari",
			price: 320,
			provider: "Dhaka Tehari",
			cat: "Rice Dishes",
			diet: DietaryType.HALAL,
			img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
		},
		{
			name: "Chicken Bhuna Khichuri",
			price: 280,
			provider: "Ghoroa Hotel",
			cat: "Traditional Cuisine",
			diet: DietaryType.HALAL,
			img: "https://images.unsplash.com/photo-1626132646529-5003375a954e",
		},
		{
			name: "Beef Kala Bhuna",
			price: 450,
			provider: "Sultan's Dine",
			cat: "Beef Dishes",
			diet: DietaryType.HALAL,
			img: "https://images.unsplash.com/photo-1541544741938-0af808871cc0",
		},
		{
			name: "Hyderabadi Chicken Biryani",
			price: 350,
			provider: "Kacchi Bhai",
			cat: "Rice Dishes",
			diet: DietaryType.HALAL,
			img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8",
		},

		// BURGERS / FAST FOOD
		{
			name: "Naga Blast Burger",
			price: 290,
			provider: "Chillox",
			cat: "Fast Food",
			diet: DietaryType.NONE,
			img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
		},
		{
			name: "Double Cheese Smash",
			price: 420,
			provider: "The Smash Lab",
			cat: "Fast Food",
			diet: DietaryType.NONE,
			img: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5",
		},
		{
			name: "Smoky BBQ Burger",
			price: 350,
			provider: "Takeout",
			cat: "Fast Food",
			diet: DietaryType.NONE,
			img: "https://images.unsplash.com/photo-1550547660-d9450f859349",
		},
		{
			name: "Whopper Meal",
			price: 550,
			provider: "Burger King",
			cat: "Fast Food",
			diet: DietaryType.NONE,
			img: "https://images.unsplash.com/photo-1571091718767-18b5b1457add",
		},
		{
			name: "Naga Chicken Wings",
			price: 250,
			provider: "Chillox",
			cat: "Snacks & Appetizers",
			diet: DietaryType.HALAL,
			img: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f",
		},

		// PIZZA / ITALIAN
		{
			name: "Pepperoni Feast Pizza",
			price: 850,
			provider: "Pizza Burg",
			cat: "Fast Food",
			diet: DietaryType.HALAL,
			img: "https://images.unsplash.com/photo-1628840042765-356cda07504e",
		},
		{
			name: "Beef Lasagna",
			price: 450,
			provider: "Alfresco",
			cat: "Curry Dishes",
			diet: DietaryType.HALAL,
			img: "https://images.unsplash.com/photo-1619895092538-1283417871fa",
		},
		{
			name: "Fettuccine Alfredo",
			price: 380,
			provider: "Alfresco",
			cat: "Traditional Cuisine",
			diet: DietaryType.NONE,
			img: "https://images.unsplash.com/photo-1645112481338-35624dc238a2",
		},
		{
			name: "Margherita Pizza",
			price: 650,
			provider: "Pizza Burg",
			cat: "Vegetarian",
			diet: DietaryType.VEGETARIAN,
			img: "https://images.unsplash.com/photo-1513104890138-7c749659a591",
		},

		// PAN-ASIAN / GLOBAL
		{
			name: "Mixed Chowmein",
			price: 320,
			provider: "Wok On Fire",
			cat: "Traditional Cuisine",
			diet: DietaryType.NONE,
			img: "https://images.unsplash.com/photo-1585032226651-759b368d7246",
		},
		{
			name: "Steamed Chicken Momo",
			price: 220,
			provider: "Madchef",
			cat: "Snacks & Appetizers",
			diet: DietaryType.HALAL,
			img: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c",
		},
		{
			name: "Thai Green Curry",
			price: 420,
			provider: "Wok On Fire",
			cat: "Curry Dishes",
			diet: DietaryType.HALAL,
			img: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd",
		},
		{
			name: "Prawn Tempura",
			price: 550,
			provider: "Madchef",
			cat: "Seafood",
			diet: DietaryType.NONE,
			img: "https://images.unsplash.com/photo-1598514983318-2f64f8f4796c",
		},

		// KABAB / GRILL
		{
			name: "Seekh Kabab Platter",
			price: 450,
			provider: "Kabab Factory",
			cat: "Traditional Cuisine",
			diet: DietaryType.HALAL,
			img: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd",
		},
		{
			name: "Chicken Shawarma",
			price: 180,
			provider: "Arabian Knight",
			cat: "Wraps & Rolls",
			diet: DietaryType.HALAL,
			img: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783",
		},
		{
			name: "Tandoori Chicken (Half)",
			price: 380,
			provider: "Kabab Factory",
			cat: "Chicken Dishes",
			diet: DietaryType.HALAL,
			img: "https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f",
		},

		// DESSERT / BAKERY
		{
			name: "Chocolate Tsunami Cake",
			price: 280,
			provider: "Secret Recipe",
			cat: "Desserts",
			diet: DietaryType.VEGETARIAN,
			img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
		},
		{
			name: "Red Velvet Slice",
			price: 220,
			provider: "Secret Recipe",
			cat: "Sweets & Bakery",
			diet: DietaryType.VEGETARIAN,
			img: "https://images.unsplash.com/photo-1586788680434-30d324b2d46f",
		},
		{
			name: "Tiramisu Cup",
			price: 320,
			provider: "Cafe Java",
			cat: "Desserts",
			diet: DietaryType.VEGETARIAN,
			img: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9",
		},

		// BEVERAGES / HEALTHY
		{
			name: "Mango Smoothie",
			price: 180,
			provider: "Juice Bar",
			cat: "Juices & Smoothies",
			diet: DietaryType.VEGETARIAN,
			img: "https://images.unsplash.com/photo-1623065422902-30a2ad44924b",
		},
		{
			name: "Iced Caramel Latte",
			price: 250,
			provider: "Cafe Java",
			cat: "Tea & Coffee",
			diet: DietaryType.VEGETARIAN,
			img: "https://images.unsplash.com/photo-1517701604599-bb29b565090c",
		},
		{
			name: "Detox Green Juice",
			price: 210,
			provider: "Juice Bar",
			cat: "Healthy",
			diet: DietaryType.VEGAN,
			img: "https://images.unsplash.com/photo-1613478223719-2ab802602423",
		},

		// BREAKFAST / OTHERS
		{
			name: "Blueberry Pancakes",
			price: 320,
			provider: "Cafe Java",
			cat: "Breakfast Items",
			diet: DietaryType.VEGETARIAN,
			img: "https://images.unsplash.com/photo-1528207776546-365bb710ee93",
		},
		{
			name: "Greek Salad",
			price: 260,
			provider: "Nani's Kitchen",
			cat: "Salads",
			diet: DietaryType.VEGAN,
			img: "https://images.unsplash.com/photo-1540420773420-3366772f4999",
		},
	];

	// Logic to fill up to 40 by creating variations if needed
	const finalMeals = rawData
		.map(item => {
			const providerId = getPId(item.provider);
			const categoryId = getCId(item.cat);

			if (!providerId || !categoryId) {
				console.warn(`⚠️ Skipping: ${item.name} (Provider/Category mismatch)`);
				return null;
			}

			return {
				name: item.name,
				description: `Delicious ${item.name} served fresh at ${item.provider}.`,
				price: item.price,
				imageUrl: `${item.img}?q=80&w=1200`,
				providerId,
				categoryId,
				dietaryType: item.diet,
				isAvailable: true,
			};
		})
		.filter(Boolean);

	await prisma.meal.createMany({
		data: finalMeals as any,
		skipDuplicates: true,
	});

	console.log(`✅ Success! Seeded ${finalMeals.length} meals.`);
}

main()
	.catch(e => {
		console.error(e);
		process.exit(1);
	})
	.finally(() => prisma.$disconnect());
