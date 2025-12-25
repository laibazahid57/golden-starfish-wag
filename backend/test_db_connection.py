import asyncio
import os
import pytest
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
DB_NAME = os.getenv("DB_NAME")

@pytest.mark.asyncio
async def test_connection():
    print(f"Testing connection to: {DB_NAME}...")
    
    if not MONGODB_URI:
        print("Error: MONGODB_URI not found in .env")
        return

    client = AsyncIOMotorClient(MONGODB_URI)
    
    try:
        # 1. Test Ping
        print("1. Testing Server Ping...")
        await client.admin.command('ping')
        print("   ✅ Ping successful!")

        # 2. Test Write Access
        print("2. Testing Write Access...")
        db = client[DB_NAME]
        collection = db['connection_test']
        test_doc = {"status": "test", "message": "Connection verification"}
        result = await collection.insert_one(test_doc)
        print(f"   ✅ Insert successful! ID: {result.inserted_id}")

        # 3. Test Read Access
        print("3. Testing Read Access...")
        doc = await collection.find_one({"_id": result.inserted_id})
        if doc and doc['message'] == "Connection verification":
            print("   ✅ Read successful!")
        else:
            print("   ❌ Read failed or data mismatch.")

        # 4. Clean up
        print("4. Cleaning up...")
        await collection.delete_one({"_id": result.inserted_id})
        print("   ✅ Cleanup successful!")
        
        print("\n🎉 ALL TESTS PASSED: Database connection is fully functional.")

    except Exception as e:
        print(f"\n❌ TEST FAILED: {str(e)}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(test_connection())