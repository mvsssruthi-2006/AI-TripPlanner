import streamlit as st
from orchestrator import TripOrchestrator

st.set_page_config(page_title="AI Trip Planner", layout="wide")

st.title("🧭 AI Trip Planner")
st.caption("Agent-based personalized travel planning system")

# =========================================================
# USER INPUT
# =========================================================

st.header("🧑‍💼 Trip Details")

col1, col2 = st.columns(2)

with col1:
    origin = st.text_input("Source", value="Bangalore")
    destination = st.text_input("Destination", value="Goa")
    days = st.number_input("Travel Days", min_value=1, max_value=30, value=3)
    travelers = st.number_input("Travelers", min_value=1, max_value=10, value=2)

with col2:
    total_budget = st.number_input("Total Budget (₹)", min_value=1000, step=1000, value=30000)
    trip_purpose = st.selectbox(
        "Trip Purpose",
        ["Vacation", "Family", "Adventure", "Business"]
    )
    travel_pace = st.selectbox(
        "Travel Pace",
        ["Relaxed", "Moderate", "Fast"]
    )
    preferred_climate = st.selectbox(
        "Preferred Climate",
        ["Warm", "Moderate", "Cold"]
    )

# =========================================================
# PREFERENCES
# =========================================================

st.header("🎯 Preferences")

col3, col4 = st.columns(2)

with col3:
    interests = st.multiselect(
        "Main Interests",
        ["Beach", "Nature", "Food", "Culture", "Shopping", "Adventure"],
        default=["Beach"]
    )
    food_preference = st.selectbox(
        "Food Preference",
        ["Veg", "Non-Veg", "Both"]
    )

with col4:
    hotel_category = st.selectbox(
        "Hotel Category",
        ["Budget", "3-star", "4-star", "5-star"]
    )
    accommodation_type = st.selectbox(
        "Accommodation Type",
        ["Hotel", "Resort", "Homestay"]
    )
    preferred_transport = st.selectbox(
        "Preferred Transport Mode",
        ["Flight", "Train", "Bus", "Car"]
    )

# =========================================================
# OPTIONAL CONSTRAINTS
# =========================================================

st.header("Must-Visit Places")

must_visit = st.text_area(
    "Must-Visit Places (comma separated)",
    placeholder="Palolem Beach, Fort Aguada"
)




# =========================================================
# RUN ORCHESTRATOR
# =========================================================

if st.button("🚀 Plan My Trip"):
    with st.spinner("AI agents are planning your trip..."):
        user_profile = {
            "origin": origin,
            "destination": destination,
            "days": days,
            "travelers": travelers,
            "budget": total_budget,
            "purpose": trip_purpose.lower(),
            "interests": [i.lower() for i in interests],
            "pace": travel_pace.lower(),
            "climate": preferred_climate.lower(),
            "hotel_category": hotel_category.lower(),
            "accommodation_type": accommodation_type.lower(),
            "transport_mode": preferred_transport.lower(),
            "food_preference": food_preference.lower(),
            "must_visit": [p.strip() for p in must_visit.split(",") if p.strip()]
        }

        planner = TripOrchestrator(user_profile)
        result = planner.run()

    if "error" in result:
        st.error(result["error"])
    else:
        st.success("✅ Trip planned successfully!")

        # ---------- METRICS ---------- #
        colA, colB, colC, colD = st.columns(4)
        colA.metric("📍 Destination", result["destination"]["destination"])
        colB.metric("🗓 Days", days)
        colC.metric("👥 Travelers", travelers)
        colD.metric("💰 Budget", f"₹{total_budget}")

        # ---------- DESTINATION ---------- #
        with st.expander("📍 Destination Overview", expanded=True):
            st.subheader("Top Attractions")

            for place in result["destination"]["top_attractions"]:
                col1, col2 = st.columns([1, 3])

                with col1:
                    if place.get("image_url"):
                        st.image(place["image_url"], use_container_width=True)

                with col2:
                    st.markdown(f"### {place['name']}")
                    # st.markdown(f"📍 **Area:** {place['area']}")
                    # st.markdown(f"🏷 **Type:** {place['type']}")

                    if place.get("description"):
                        st.markdown(f"📝 {place['description']}")
                        
                        
     
    # HOTELS (UNCHANGED FROM ORIGINAL)
    # =========================================================
        with st.expander("🏨 Accommodation Options", expanded=True):
            if result.get("hotels"):
                for area, hotels in result["hotels"].items():
                    st.markdown(f"## 📌 {area}")
                    for h in hotels:  # Each area has up to 4 hotels
                        st.markdown(f"### 🏨 {h['name']}")
                        st.markdown(f"💰 *Price:* {h['price_per_night']}")
                        st.markdown(f"🎯 *Suitable for:* {h.get('suitable_for', '')}")
                        if h.get("booking_link"):
                            st.markdown(f"[🟢 Book Now]({h['booking_link']})")
                        st.divider()
            else:
                st.write("No accommodation data available.")
           

         # =========================================================
    # TRANSPORT (ONLY BOOK NOW BUTTON CHANGED)
    # =========================================================
        with st.expander("🚍 Transport Options", expanded=True):
            transport = result.get("transport")

            if transport and transport.get("options"):
                st.subheader(f"Preferred Mode: {transport.get('mode', '').capitalize()}")

                for opt in transport["options"]:
                    st.markdown(f"### 🚀 {opt.get('name')}")

                    st.markdown(
                        f"""
                        - *Departure:* {opt.get('departure')}
                        - *Duration:* {opt.get('duration')}
                        - *Price:* {opt.get('price')}
                        - *Comfort:* {opt.get('comfort')}
                        - *Recommended for:* {opt.get('recommended_for')}
                        - *Why:* {opt.get('reason')}
                        """
                    )

                    if opt.get("booking_link"):
                        st.markdown(f"[🟢 Book Now]({opt['booking_link']})")

                    st.divider()
            else:
                st.warning("No transport data available.")

        # ---------------- ITINERARY ---------------- #

        with st.expander("🗓 Day-wise Itinerary", expanded=True):
            for day, plan in result["itinerary"].items():
                st.markdown(f"### {day}")
                st.markdown(f"**Morning:** {plan['Morning']}")
                st.markdown(f"**Afternoon:** {plan['Afternoon']}")
                st.markdown(f"**Evening:** {plan['Evening']}")
      

        # ---------------- BUDGET ---------------- #

        with st.expander("💰 Estimated Budget", expanded=True):
            budget = result["budget"]
            st.markdown(f"- **Hotel Budget:** {budget['hotel_budget']}")
            st.markdown(f"- **Transport Budget:** {budget['transport_budget']}")
            st.markdown(f"- **Daily Expenses:** {budget['daily_expenses']}")
            st.markdown(f"### 🧾 Total Estimated Budget: {budget['total_estimated_budget']}")

        with st.expander("🧠 Why this trip plan?", expanded=True):
            st.write(result.get("explanation", ""))