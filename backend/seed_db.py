import asyncio
import os
import random
import string
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
DB_NAME = os.getenv("DB_NAME")

def generate_id():
    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=9))

def get_now():
    return datetime.utcnow().isoformat() + "Z"

# Mock Data
def get_mock_data():
    now = get_now()
    
    # McDonald's
    mcdonalds_id = generate_id()
    
    restaurants = [
        {
            "restaurant_id": mcdonalds_id,
            "name": "McDonald's",
            "address": "123 Main St, Anytown, USA",
            "latitude": 34.052235,
            "longitude": -118.243683,
            "chain_name": "McDonald's",
            "created_date": now,
            "last_modified_date": now,
            "menu_items": [
                {
                    "menu_item_id": generate_id(),
                    "restaurant_id": mcdonalds_id,
                    "name": "Hamburger",
                    "description": "Classic beef patty with pickles, onions, ketchup, and mustard.",
                    "calories": 250,
                    "fat_g": 9,
                    "carbs_g": 31,
                    "protein_g": 12,
                    "sugar_g": 6,
                    "created_date": now,
                    "last_modified_date": now,
                },
                {
                    "menu_item_id": generate_id(),
                    "restaurant_id": mcdonalds_id,
                    "name": "Cheeseburger",
                    "description": "Classic beef patty with a slice of melty cheese, pickles, onions, ketchup, and mustard.",
                    "calories": 300,
                    "fat_g": 12,
                    "carbs_g": 33,
                    "protein_g": 15,
                    "sugar_g": 7,
                    "created_date": now,
                    "last_modified_date": now,
                },
                {
                    "menu_item_id": generate_id(),
                    "restaurant_id": mcdonalds_id,
                    "name": "Big Mac",
                    "description": "Two 100% pure beef patties, special sauce, lettuce, cheese, pickles, onions on a sesame seed bun.",
                    "calories": 550,
                    "fat_g": 29,
                    "carbs_g": 45,
                    "protein_g": 25,
                    "sugar_g": 9,
                    "created_date": now,
                    "last_modified_date": now,
                },
                {
                    "menu_item_id": generate_id(),
                    "restaurant_id": mcdonalds_id,
                    "name": "Quarter Pounder with Cheese",
                    "description": "A quarter-pound of 100% fresh beef, two slices of cheese, slivered onions, and tangy pickles on a sesame seed bun.",
                    "calories": 520,
                    "fat_g": 26,
                    "carbs_g": 41,
                    "protein_g": 30,
                    "sugar_g": 10,
                    "created_date": now,
                    "last_modified_date": now,
                },
                {
                    "menu_item_id": generate_id(),
                    "restaurant_id": mcdonalds_id,
                    "name": "McChicken",
                    "description": "Crispy chicken patty, shredded lettuce, and mayonnaise-style sauce on a sesame seed bun.",
                    "calories": 400,
                    "fat_g": 21,
                    "carbs_g": 39,
                    "protein_g": 14,
                    "sugar_g": 5,
                    "created_date": now,
                    "last_modified_date": now,
                },
                {
                    "menu_item_id": generate_id(),
                    "restaurant_id": mcdonalds_id,
                    "name": "Filet-O-Fish",
                    "description": "Wild-caught fish patty, tartar sauce, and a half slice of cheese on a steamed bun.",
                    "calories": 390,
                    "fat_g": 19,
                    "carbs_g": 39,
                    "protein_g": 15,
                    "sugar_g": 5,
                    "created_date": now,
                    "last_modified_date": now,
                },
                {
                    "menu_item_id": generate_id(),
                    "restaurant_id": mcdonalds_id,
                    "name": "6 Piece Chicken McNuggets",
                    "description": "Six tender, juicy Chicken McNuggets.",
                    "calories": 270,
                    "fat_g": 16,
                    "carbs_g": 16,
                    "protein_g": 14,
                    "sugar_g": 0,
                    "created_date": now,
                    "last_modified_date": now,
                },
                {
                    "menu_item_id": generate_id(),
                    "restaurant_id": mcdonalds_id,
                    "name": "Small Fries",
                    "description": "World Famous Fries, hot and crispy.",
                    "calories": 230,
                    "fat_g": 11,
                    "carbs_g": 30,
                    "protein_g": 2,
                    "sugar_g": 0,
                    "created_date": now,
                    "last_modified_date": now,
                },
                {
                    "menu_item_id": generate_id(),
                    "restaurant_id": mcdonalds_id,
                    "name": "Medium Fries",
                    "description": "World Famous Fries, hot and crispy.",
                    "calories": 320,
                    "fat_g": 15,
                    "carbs_g": 42,
                    "protein_g": 3,
                    "sugar_g": 0,
                    "created_date": now,
                    "last_modified_date": now,
                },
                {
                    "menu_item_id": generate_id(),
                    "restaurant_id": mcdonalds_id,
                    "name": "Large Fries",
                    "description": "World Famous Fries, hot and crispy.",
                    "calories": 480,
                    "fat_g": 23,
                    "carbs_g": 63,
                    "protein_g": 5,
                    "sugar_g": 0,
                    "created_date": now,
                    "last_modified_date": now,
                },
                {
                    "menu_item_id": generate_id(),
                    "restaurant_id": mcdonalds_id,
                    "name": "Coca-Cola (Small)",
                    "description": "Refreshing Coca-Cola.",
                    "calories": 150,
                    "fat_g": 0,
                    "carbs_g": 41,
                    "protein_g": 0,
                    "sugar_g": 41,
                    "created_date": now,
                    "last_modified_date": now,
                },
            ]
        },
        {
            "restaurant_id": generate_id(),
            "name": "Subway",
            "address": "456 Oak Ave, Anytown, USA",
            "latitude": 34.052235,
            "longitude": -118.243683,
            "chain_name": "Subway",
            "created_date": now,
            "last_modified_date": now,
            "menu_items": [
                {
                    "menu_item_id": generate_id(),
                    "restaurant_id": "",
                    "name": "6-inch Veggie Delite (no cheese, no mayo)",
                    "description": "Fresh veggies on 9-grain wheat bread.",
                    "calories": 200,
                    "fat_g": 2,
                    "carbs_g": 39,
                    "protein_g": 9,
                    "sugar_g": 5,
                    "created_date": now,
                    "last_modified_date": now,
                },
                {
                    "menu_item_id": generate_id(),
                    "restaurant_id": "",
                    "name": "6-inch Turkey Breast (no cheese, no mayo)",
                    "description": "Lean turkey breast on 9-grain wheat bread with fresh veggies.",
                    "calories": 250,
                    "fat_g": 3,
                    "carbs_g": 39,
                    "protein_g": 18,
                    "sugar_g": 5,
                    "created_date": now,
                    "last_modified_date": now,
                }
            ]
        },
        {
            "restaurant_id": generate_id(),
            "name": "Burger King",
            "address": "789 Pine Ln, Anytown, USA",
            "latitude": 34.052235,
            "longitude": -118.243683,
            "chain_name": "Burger King",
            "created_date": now,
            "last_modified_date": now,
            "menu_items": [
                {
                    "menu_item_id": generate_id(),
                    "restaurant_id": "",
                    "name": "Whopper",
                    "description": "A quarter-pound of flame-grilled beef, tomatoes, lettuce, mayo, ketchup, pickles, and onions on a sesame seed bun.",
                    "calories": 670,
                    "fat_g": 39,
                    "carbs_g": 49,
                    "protein_g": 29,
                    "sugar_g": 11,
                    "created_date": now,
                    "last_modified_date": now,
                },
                {
                    "menu_item_id": generate_id(),
                    "restaurant_id": "",
                    "name": "Impossible Whopper",
                    "description": "Plant-based patty, tomatoes, lettuce, mayo, ketchup, pickles, and onions on a sesame seed bun.",
                    "calories": 630,
                    "fat_g": 34,
                    "carbs_g": 60,
                    "protein_g": 25,
                    "sugar_g": 12,
                    "created_date": now,
                    "last_modified_date": now,
                }
            ]
        },
        {
            "restaurant_id": generate_id(),
            "name": "Taco Bell",
            "address": "789 Pine Ln, Anytown, USA",
            "latitude": 34.052235,
            "longitude": -118.243683,
            "chain_name": "Taco Bell",
            "created_date": now,
            "last_modified_date": now,
            "menu_items": [
                {
                    "menu_item_id": generate_id(),
                    "restaurant_id": "",
                    "name": "Crunchy Taco Supreme Beef",
                    "description": "Seasoned beef, reduced-fat sour cream, crisp lettuce, diced tomatoes, and shredded cheddar cheese in a crunchy taco shell.",
                    "calories": 190,
                    "fat_g": 11,
                    "carbs_g": 14,
                    "protein_g": 9,
                    "sugar_g": 2,
                    "created_date": now,
                    "last_modified_date": now,
                },
                {
                    "menu_item_id": generate_id(),
                    "restaurant_id": "",
                    "name": "Bean Burrito",
                    "description": "Warm flour tortilla filled with refried beans, red sauce, diced onions, and shredded cheddar cheese.",
                    "calories": 380,
                    "fat_g": 11,
                    "carbs_g": 55,
                    "protein_g": 14,
                    "sugar_g": 4,
                    "created_date": now,
                    "last_modified_date": now,
                }
            ]
        }
    ]
    
    # Fix restaurant_id references
    for r in restaurants:
        for item in r["menu_items"]:
            if not item["restaurant_id"]:
                item["restaurant_id"] = r["restaurant_id"]

    return restaurants

async def seed_db():
    print("🌱 Starting database seeding...")
    
    if not MONGODB_URI:
        print("❌ Error: MONGODB_URI not found in .env")
        return

    client = AsyncIOMotorClient(MONGODB_URI)
    db = client[DB_NAME]
    collection = db['restaurants']

    try:
        # 1. Clear existing data
        print("🧹 Clearing existing restaurants...")
        await collection.delete_many({})
        print("   ✅ Cleared!")

        # 2. Prepare data with GeoJSON
        print("🛠️  Preparing data...")
        restaurants = get_mock_data()
        
        for r in restaurants:
            # Create GeoJSON location field
            # MongoDB expects [longitude, latitude]
            r['location'] = {
                'type': 'Point',
                'coordinates': [r['longitude'], r['latitude']]
            }
            # Ensure proper typing for lat/long if they exist
            r['latitude'] = float(r['latitude'])
            r['longitude'] = float(r['longitude'])

        # 3. Insert data
        print(f"📥 Inserting {len(restaurants)} restaurants...")
        result = await collection.insert_many(restaurants)
        print(f"   ✅ Successfully inserted {len(result.inserted_ids)} restaurants!")

        # 4. Create Geospatial Index
        print("📍 Creating geospatial index...")
        await collection.create_index([("location", "2dsphere")])
        print("   ✅ Index created!")
        
        # 5. Verify Insertion (Optional but good)
        count = await collection.count_documents({})
        print(f"\n🎉 Database successfully seeded with {count} restaurants!")

    except Exception as e:
        print(f"\n❌ SEEDING FAILED: {str(e)}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(seed_db())