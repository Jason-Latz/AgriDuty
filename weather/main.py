import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor, VotingRegressor
from sklearn.tree import DecisionTreeRegressor
from sklearn.neighbors import KNeighborsRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_squared_error

# Load the dataset
df = pd.read_csv("dataset.csv")

# Encode categorical columns
le_crop = LabelEncoder()
df['crop_type'] = le_crop.fit_transform(df['crop_type'])  # e.g., Hay & Forages → 0, Lettuce → 1, etc.

# Ensure month is numeric (you can encode if needed)
# df['month'] = LabelEncoder().fit_transform(df['month'])  # optional if month is already numeric

# Features and target
X = df.drop(columns=['quantity_normalized'])
y = df['quantity_normalized']

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Define base models
rf = RandomForestRegressor(n_estimators=100, random_state=42)
dt = DecisionTreeRegressor(random_state=42)
gb = GradientBoostingRegressor(n_estimators=100, learning_rate=0.1, random_state=42)
knn = KNeighborsRegressor(n_neighbors=5)

# Ensemble Regressor
ensemble = VotingRegressor(estimators=[
    ('rf', rf),
    ('dt', dt),
    ('gb', gb),
    ('knn', knn)
])

# Train the model
ensemble.fit(X_train, y_train)

# Predict
y_pred = ensemble.predict(X_test)   

# Evaluate
mse = mean_squared_error(y_test, y_pred)
print(f"✅ Ensemble Model MSE: {mse:.4f}")

# Predict again (in case you've restarted)
y_pred = ensemble.predict(X_test)

# Create comparison DataFrame
comparison_df = pd.DataFrame({
    'Actual': y_test.values[:15],
    'Predicted': y_pred[:15]
})

print("🔍 Actual vs Predicted (first 15):\n")
print(comparison_df)

# Optional: Plot for better visual understanding
plt.figure(figsize=(10, 5))
plt.plot(comparison_df['Actual'].values, marker='o', label='Actual', color='green')
plt.plot(comparison_df['Predicted'].values, marker='x', label='Predicted', color='blue')
plt.title("Actual vs Predicted - First 15 Samples")
plt.xlabel("Sample Index")
plt.ylabel("Quantity Normalized")
plt.legend()
plt.grid(True)
plt.tight_layout()
plt.show()