import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor, VotingRegressor
from sklearn.tree import DecisionTreeRegressor
from sklearn.neighbors import KNeighborsRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_squared_error
from joblib import dump  # Import joblib for saving the model
from sklearn.impute import SimpleImputer  # Import SimpleImputer for handling missing values
from sklearn.pipeline import Pipeline  # Import Pipeline for creating a processing pipeline

# Load the dataset
df = pd.read_csv("dataset.csv")

# Load crop types from crops.txt
with open('crops.txt', 'r') as file:
    crops = [line.strip() for line in file.readlines()]  # Read and strip whitespace

# Create a mapping from crop names to integers
crop_mapping = {crop: index for index, crop in enumerate(crops)}

# Map the crop_type in the DataFrame using the mapping
df['crop_type'] = df['crop_type'].map(crop_mapping)

# Ensure month is numeric (you can encode if needed)
# df['month'] = LabelEncoder().fit_transform(df['month'])  # optional if month is already numeric

# Features and target
X = df.drop(columns=['quantity_normalized'])
y = df['quantity_normalized']

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Define the imputer to handle missing values
imputer = SimpleImputer(strategy='mean')  # You can choose other strategies like 'median' or 'most_frequent'

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

# Build a pipeline that handles any missing values before passing the data to
# the ensemble model. Using a pipeline keeps preprocessing and model execution
# together for easier reuse.
pipeline = Pipeline(steps=[
    ('imputer', imputer),
    ('ensemble', ensemble)
])

# Train the model using the pipeline
pipeline.fit(X_train, y_train)

# Save the model as a .pkl file
dump(pipeline, 'model.pkl')  # Save the trained model to a .pkl file

# Predict
y_pred = pipeline.predict(X_test)   

# Evaluate
mse = mean_squared_error(y_test, y_pred)
print(f"✅ Ensemble Model MSE: {mse:.4f}")
