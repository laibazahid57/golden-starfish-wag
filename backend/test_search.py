import httpx
import asyncio
import pytest
from main import app

# Base URL for the API
BASE_URL = "http://127.0.0.1:8000"

async def test_search_endpoint():
    print("\n🧪 Testing Search Endpoint...")
    
    async with httpx.AsyncClient(base_url=BASE_URL, timeout=30.0) as client:
        # Test Case 1: Search near McDonald's (Los Angeles) with 5 miles radius
        # Lat: 34.052235, Lng: -118.243683 (from mockData.ts/seed_db.py)
        print("\n📍 Test Case 1: Search near LA (should find restaurants)")
        params_near = {
            "lat": 34.052235,
            "lng": -118.243683,
            "mileage": 5
        }
        response_near = await client.get("/restaurants/search", params=params_near)
        
        if response_near.status_code == 200:
            results = response_near.json()
            print(f"   ✅ Status 200 OK")
            print(f"   Found {len(results)} restaurants")
            if len(results) > 0:
                print(f"   Sample: {results[0]['name']}")
            else:
                print("   ⚠️  Warning: No restaurants found (Database might be empty or index missing)")
                
            assert len(results) > 0, "Should have found restaurants near LA"
        else:
            print(f"   ❌ Failed: {response_near.status_code}")
            print(f"   Response: {response_near.text}")
            assert False, "Search request failed"

        # Test Case 2: Search far away (e.g., New York/New Jersey)
        # Lat: 40.0, Lng: -74.0
        print("\n📍 Test Case 2: Search far away (should be empty)")
        params_far = {
            "lat": 40.0,
            "lng": -74.0,
            "mileage": 1
        }
        response_far = await client.get("/restaurants/search", params=params_far)
        
        if response_far.status_code == 200:
            results_far = response_far.json()
            print(f"   ✅ Status 200 OK")
            print(f"   Found {len(results_far)} restaurants")
            
            assert len(results_far) == 0, "Should NOT find restaurants in NJ"
        else:
            print(f"   ❌ Failed: {response_far.status_code}")
            print(f"   Response: {response_far.text}")
            assert False, "Search request failed"

        # Test Case 3: Calorie Filtering
        # Search with max_calories=300
        print("\n📍 Test Case 3: Calorie Filtering (max 300 cal)")
        params_calories = {
            "lat": 34.052235,
            "lng": -118.243683,
            "mileage": 5,
            "max_calories": 300
        }
        response_calories = await client.get("/restaurants/search", params=params_calories)
        
        if response_calories.status_code == 200:
            results_calories = response_calories.json()
            print(f"   ✅ Status 200 OK")
            print(f"   Found {len(results_calories)} restaurants")
            
            assert len(results_calories) > 0, "Should find restaurants with items <= 300 cal"
            
            # Verify filtering
            found_hamburger = False
            found_big_mac = False
            
            for restaurant in results_calories:
                for item in restaurant.get("menu_items", []):
                    if item["name"] == "Hamburger":
                        found_hamburger = True
                    if item["name"] == "Big Mac":
                        found_big_mac = True
                    
                    # Double check calories
                    assert item["calories"] <= 300, f"Found item > 300 cal: {item['name']} ({item['calories']})"
            
            if found_hamburger:
                 print("   ✅ Found 'Hamburger' (250 cal)")
            else:
                 print("   ❌ 'Hamburger' not found (Should be present)")

            if not found_big_mac:
                 print("   ✅ 'Big Mac' (550 cal) correctly filtered out")
            else:
                 print("   ❌ Found 'Big Mac' (Should be filtered out)")

            assert found_hamburger, "Hamburger should be present"
            assert not found_big_mac, "Big Mac should NOT be present"

        else:
            print(f"   ❌ Failed: {response_calories.status_code}")
            print(f"   Response: {response_calories.text}")
            assert False, "Search request failed"

    print("\n✨ Search Tests Completed!")

if __name__ == "__main__":
    asyncio.run(test_search_endpoint())