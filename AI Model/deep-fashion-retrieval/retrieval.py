# -*- coding: utf-8 -*-

import os
import sys
import numpy as np
from scipy.spatial.distance import cdist
from torch.autograd import Variable
from config import *
from utils import *
from data import Fashion_attr_prediction
from net import f_model, c_model, p_model
from sklearn.externals import joblib


@timer_with_task("Loading model")
def load_test_model(with_clsf=False):
    if not os.path.isfile(DUMPED_MODEL) and not os.path.isfile(os.path.join(DATASET_BASE, "models", DUMPED_MODEL)):
        print("No trained model file!")
        return
    main_model = f_model(model_path=DUMPED_MODEL).cuda(GPU_ID)
    color_model = c_model().cuda(GPU_ID)
    pooling_model = p_model().cuda(GPU_ID)

    if not with_clsf:
        extractor = FeatureExtractor(main_model, color_model, pooling_model)
    else:
        extractor = FeatureExtractorWithClassification(main_model, color_model, pooling_model)
    return extractor

# Original function
# @timer_with_task("Loading feature database")
# def load_feat_db():
#     feat_all = os.path.join(DATASET_BASE, 'all_feat.npy')
#     feat_list = os.path.join(DATASET_BASE, 'all_feat.list')
#     color_feat = os.path.join(DATASET_BASE, 'all_color_feat.npy')
#     if not os.path.isfile(feat_list) or not os.path.isfile(feat_all) or not os.path.isfile(color_feat):
#         print("No feature db file! Please run feature_extractor.py first.")
#         return
#     deep_feats = np.load(feat_all)
#     color_feats = np.load(color_feat)
#     with open(feat_list) as f:
#         labels = list(map(lambda x: x.strip(), f.readlines()))
#     return deep_feats, color_feats, labels

#modified for scrapped dataset
@timer_with_task("Loading feature database")
def load_feat_db(custom=False):
    if not custom:
        feat_all = os.path.join(DATASET_BASE, 'all_feat.npy')
        feat_list = os.path.join(DATASET_BASE, 'all_feat.list')
        color_feat = os.path.join(DATASET_BASE, 'all_color_feat.npy')
        if not os.path.isfile(feat_list) or not os.path.isfile(feat_all) or not os.path.isfile(color_feat):
            print("No feature db file! Please run feature_extractor.py first.")
            return

    else:
        feat_all = os.path.join(DATASET_BASE, 'custom_all_feat.npy')
        feat_list = os.path.join(DATASET_BASE, 'custom_all_feat.list')
        color_feat = os.path.join(DATASET_BASE, 'custom_all_color_feat.npy')
        if not os.path.isfile(feat_list) or not os.path.isfile(feat_all) or not os.path.isfile(color_feat):
            print("No feature db file for scrapped dataset! Please run feature_extractor.py --scrapped first.")
            return

    deep_feats = np.load(feat_all)
    color_feats = np.load(color_feat)
    with open(feat_list) as f:
        labels = list(map(lambda x: x.strip(), f.readlines()))
    return deep_feats, color_feats, labels


@timer_with_task("Loading feature K-means model")
def load_kmeans_model(custom=False):
    if not custom:
        clf_model_path = os.path.join(DATASET_BASE, r'models', r'kmeans.m')
    else:
        clf_model_path = os.path.join(DATASET_BASE, r'models', r'kmeans_scrapped.m')
        
    clf = joblib.load(clf_model_path)
    return clf


def read_lines(path):
    with open(path) as fin:
        lines = fin.readlines()[2:]
        lines = list(filter(lambda x: len(x) > 0, lines))
        names = list(map(lambda x: x.strip().split()[0], lines))
    return names


def get_top_n(dist, labels, retrieval_top_n):
    ind = np.argpartition(dist, -retrieval_top_n)[-retrieval_top_n:][::-1]
    ret = list(zip([labels[i] for i in ind], dist[ind]))
    ret = sorted(ret, key=lambda x: x[1], reverse=True)
    return ret


def get_similarity(feature, feats, metric='cosine'):
    # print(f'metric: {metric}')
    dist = -cdist(np.expand_dims(feature, axis=0), feats, metric)[0]
    # print(f'dist: {dist}')
    return dist


def get_deep_color_top_n(features, deep_feats, color_feats, labels, retrieval_top_n=5):
    deep_scores = get_similarity(features[0], deep_feats, DISTANCE_METRIC[0])
    color_scores = get_similarity(features[1], color_feats, DISTANCE_METRIC[1])
    results = get_top_n(deep_scores + color_scores * COLOR_WEIGHT, labels, retrieval_top_n)
    return results


@timer_with_task("Doing naive query")
def naive_query(features, deep_feats, color_feats, labels, retrieval_top_n=5):
    results = get_deep_color_top_n(features, deep_feats, color_feats, labels, retrieval_top_n)
    return results


@timer_with_task("Doing query with k-Means")
def kmeans_query(clf, features, deep_feats, color_feats, labels, retrieval_top_n=5):
    label = clf.predict(features[0].reshape(1, features[0].shape[0]))
    ind = np.where(clf.labels_ == label)
    d_feats = deep_feats[ind]
    c_feats = color_feats[ind]
    n_labels = list(np.array(labels)[ind])
    results = get_deep_color_top_n(features, d_feats, c_feats, n_labels, retrieval_top_n)
    return results


@timer_with_task("Extracting image feature")
def dump_single_feature(img_path, extractor, custom=False, with_clsf=False, allowed_inds=None):
    paths = [img_path, os.path.join(DATASET_BASE, img_path), os.path.join(DATASET_BASE, 'in_shop', img_path)]
    # print(f'paths: {paths}')
    for i in paths:
        if not os.path.isfile(i):
            continue
        # print(f'img_path: {i}')
        # print(f'Custom: {custom}')
        if custom:
            single_loader = torch.utils.data.DataLoader(
            Fashion_attr_prediction(type="single", img_path=i, crop=True, transform=data_transform_test, custom=True),
            batch_size=1, num_workers=NUM_WORKERS, pin_memory=True
            )

        else:
            single_loader = torch.utils.data.DataLoader(
                Fashion_attr_prediction(type="single", img_path=i, transform=data_transform_test),
                batch_size=1, num_workers=NUM_WORKERS, pin_memory=True
            )
        data = list(single_loader)[0]   # Get loaded image as tensor 
        data = Variable(data).cuda(GPU_ID)

        if not with_clsf:
            deep_feat, color_feat = extractor(data)
            deep_feat = deep_feat[0].squeeze()
            color_feat = color_feat[0]
            return deep_feat, color_feat

        else:
            cls, deep_feat, color_feat = extractor(data)
            cls = cls.squeeze()
            # print(f'cls.shape: {cls.shape}')
            if allowed_inds is not None:
                class_n = allowed_inds[cls[allowed_inds].argmax()] + 1
            else:
                class_n = cls.argmax() + 1  # +1 because index starts from 0 but category labels start from 1
            deep_feat = deep_feat[0].squeeze()
            color_feat = color_feat[0]
            return class_n, deep_feat, color_feat
    return None


def visualize(original, result, cols=1):
    import matplotlib.pyplot as plt
    import cv2
    n_images = len(result) + 1
    titles = ["Original"] + ["Score: {:.4f}".format(v) for k, v in result]
    images = [original] + [k for k, v in result]
    mod_full_path = lambda x: os.path.join(DATASET_BASE, x) \
        if os.path.isfile(os.path.join(DATASET_BASE, x)) \
        else os.path.join(DATASET_BASE, 'in_shop', x,)
    images = list(map(mod_full_path, images))
    images = list(map(lambda x: cv2.cvtColor(cv2.imread(x), cv2.COLOR_BGR2RGB), images))
    fig = plt.figure()
    for n, (image, title) in enumerate(zip(images, titles)):
        a = fig.add_subplot(cols, np.ceil(n_images / float(cols)), n + 1)
        plt.imshow(image)
        a.set_title(title)
    fig.set_size_inches(np.array(fig.get_size_inches()) * n_images * 0.25)
    plt.show()


if __name__ == "__main__":
    example = "img/Sheer_Pleated-Front_Blouse/img_00000005.jpg"
    if len(sys.argv) > 1 and sys.argv[1].endswith("jpg"):
        example = sys.argv[1]
    else:
        print("Usage: python {} img_path\nNo input image, use default.".format(sys.argv[0]))

    extractor = load_test_model()
    deep_feats, color_feats, labels = load_feat_db()
    f = dump_single_feature(example, extractor)

    if any(list(map(lambda x: x is None, f))):
        print("Input feature is None")
        exit()

    clf = load_kmeans_model()

    result = naive_query(f, deep_feats, color_feats, labels, 5)
    result_kmeans = kmeans_query(clf, f, deep_feats, color_feats, labels, 5)

    print("Naive query result:", result)
    print("K-Means query result:", result_kmeans)
    visualize(example, result)
    visualize(example, result_kmeans)