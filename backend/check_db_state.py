import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from config import settings
import os

# Ensure we use the same environment variables as the app
# (assuming they are set in the environment or .env file which config.py reads)

async def check_db():
    print(f"Connecting to MongoDB at {settings.MONGODB_URI}...")
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    db = client[settings.DB_NAME]
    
    try:
        # Check connection
        await client.admin.command('ping')
        print("✅ Connected to MongoDB")
        
        collection = db["restaurants"]
        
        # 1. Count documents
        count = await collection.count_documents({})
        print(f"📊 Total Restaurants: {count}")
        
        if count == 0:
            print("⚠️  Warning: No restaurants found in the database. Run 'seed_db.py' to populate data.")
        else:
            # 2. Check sample document
            sample = await collection.find_one({})
            print(f"📄 Sample Restaurant: {sample.get('name', 'Unknown')}")
            print(f"   Location field: {sample.get('location')}")
            
            # Check GeoJSON format
            loc = sample.get('location')
            if loc and loc.get('type') == 'Point' and isinstance(loc.get('coordinates'), list):
                print("   ✅ Location format looks correct (GeoJSON Point)")
            else:
                print("   ❌ Invalid location format! Should be GeoJSON Point.")

        # 3. Check Indexes
        print("\n🔍 Indexes:")
        indexes = await collection.index_information()
        has_2dsphere = False
        for name, info in indexes.items():
            print(f"   - {name}: {info['key']}")
            for field, type_ in info['key']:
                if field == 'location' and type_ == '2dsphere':
                    has_2dsphere = True
        
        if has_2dsphere:
            print("   ✅ '2dsphere' index on 'location' found.")
        else:
            print("   ❌ Missing '2dsphere' index on 'location'! Geospatial queries will fail.")
            print("   💡 Run 'seed_db.py' (it usually creates indexes) or create it manually.")

    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(check_db())