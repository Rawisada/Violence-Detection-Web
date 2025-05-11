from keras.applications.vgg16 import VGG16
from keras.models import Model
from keras.layers import Dense, Input
import numpy as np
import cv2

def load_models():
    input_temporal = Input(shape=(224, 224, 3))
    base_model_temporal = VGG16(weights='imagenet', include_top=True, input_tensor=input_temporal)
    x_temporal = base_model_temporal.get_layer('fc2').output
    x_temporal = Dense(2048, activation='relu', name='fc2_2048')(x_temporal)
    temporal_model = Model(inputs=input_temporal, outputs=x_temporal)

    input_spatial = Input(shape=(224, 224, 3))
    base_model_spatial = VGG16(weights='imagenet', include_top=True, input_tensor=input_spatial)
    x_spatial = base_model_spatial.get_layer('fc2').output
    x_spatial = Dense(2048, activation='relu', name='fc2_2048')(x_spatial)
    spatial_model = Model(inputs=input_spatial, outputs=x_spatial)

    return temporal_model, spatial_model

def extract_spatial_features(frame):
    frame = cv2.resize(frame, (224, 224))
    frame = np.expand_dims(frame, axis=0)
    return frame
