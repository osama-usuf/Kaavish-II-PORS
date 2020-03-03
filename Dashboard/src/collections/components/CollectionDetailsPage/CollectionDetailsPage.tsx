import { RawDraftContentState } from "draft-js";
import React from "react";
import { useIntl } from "react-intl";

import AppHeader from "@Kaavish/components/AppHeader";
import { CardSpacer } from "@Kaavish/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@Kaavish/components/ConfirmButton";
import { Container } from "@Kaavish/components/Container";
import ControlledCheckbox from "@Kaavish/components/ControlledCheckbox";
import Form from "@Kaavish/components/Form";
import FormSpacer from "@Kaavish/components/FormSpacer";
import Grid from "@Kaavish/components/Grid";
import Hr from "@Kaavish/components/Hr";
import PageHeader from "@Kaavish/components/PageHeader";
import SaveButtonBar from "@Kaavish/components/SaveButtonBar";
import SeoForm from "@Kaavish/components/SeoForm";
import VisibilityCard from "@Kaavish/components/VisibilityCard";
import useDateLocalize from "@Kaavish/hooks/useDateLocalize";
import { sectionNames } from "@Kaavish/intl";
import { maybe } from "../../../misc";
import { ListActions, PageListProps } from "../../../types";
import { CollectionDetails_collection } from "../../types/CollectionDetails";
import CollectionDetails from "../CollectionDetails/CollectionDetails";
import { CollectionImage } from "../CollectionImage/CollectionImage";
import CollectionProducts from "../CollectionProducts/CollectionProducts";

export interface CollectionDetailsPageFormData {
  backgroundImageAlt: string;
  description: RawDraftContentState;
  name: string;
  publicationDate: string;
  seoDescription: string;
  seoTitle: string;
  isFeatured: boolean;
  isPublished: boolean;
}

export interface CollectionDetailsPageProps extends PageListProps, ListActions {
  collection: CollectionDetails_collection;
  isFeatured: boolean;
  saveButtonBarState: ConfirmButtonTransitionState;
  onBack: () => void;
  onCollectionRemove: () => void;
  onImageDelete: () => void;
  onImageUpload: (file: File) => void;
  onProductUnassign: (id: string, event: React.MouseEvent<any>) => void;
  onSubmit: (data: CollectionDetailsPageFormData) => void;
}

const CollectionDetailsPage: React.StatelessComponent<
  CollectionDetailsPageProps
> = ({
  collection,
  disabled,
  isFeatured,
  saveButtonBarState,
  onBack,
  onCollectionRemove,
  onImageDelete,
  onImageUpload,
  onSubmit,
  ...collectionProductsProps
}: CollectionDetailsPageProps) => {
  const intl = useIntl();
  const localizeDate = useDateLocalize();

  return (
    <Form
      initial={{
        backgroundImageAlt: maybe(() => collection.backgroundImage.alt, ""),
        description: maybe(() => JSON.parse(collection.descriptionJson)),
        isFeatured,
        isPublished: maybe(() => collection.isPublished, false),
        name: maybe(() => collection.name, ""),
        publicationDate: maybe(() => collection.publicationDate, ""),
        seoDescription: maybe(() => collection.seoDescription, ""),
        seoTitle: maybe(() => collection.seoTitle, "")
      }}
      onSubmit={onSubmit}
      confirmLeave
    >
      {({ change, data, errors: formErrors, hasChanged, submit }) => (
        <Container>
          <AppHeader onBack={onBack}>
            {intl.formatMessage(sectionNames.collections)}
          </AppHeader>
          <PageHeader title={maybe(() => collection.name)} />
          <Grid>
            <div>
              <CollectionDetails
                collection={collection}
                data={data}
                disabled={disabled}
                errors={formErrors}
                onChange={change}
              />
              <CardSpacer />
              <CollectionImage
                data={data}
                image={maybe(() => collection.backgroundImage)}
                onImageDelete={onImageDelete}
                onImageUpload={onImageUpload}
                onChange={change}
              />
              <CardSpacer />
              <CollectionProducts
                disabled={disabled}
                collection={collection}
                {...collectionProductsProps}
              />
              <CardSpacer />
              <SeoForm
                description={data.seoDescription}
                disabled={disabled}
                descriptionPlaceholder=""
                helperText={intl.formatMessage({
                  defaultMessage:
                    "Add search engine title and description to make this collection easier to find"
                })}
                title={data.seoTitle}
                titlePlaceholder={maybe(() => collection.name)}
                onChange={change}
              />
            </div>
            <div>
              <div>
                <VisibilityCard
                  data={data}
                  errors={formErrors}
                  disabled={disabled}
                  hiddenMessage={intl.formatMessage(
                    {
                      defaultMessage: "will be visible from {date}",
                      description: "collection"
                    },
                    {
                      date: localizeDate(data.publicationDate)
                    }
                  )}
                  onChange={change}
                  visibleMessage={intl.formatMessage(
                    {
                      defaultMessage: "since {date}",
                      description: "collection"
                    },
                    {
                      date: localizeDate(data.publicationDate)
                    }
                  )}
                >
                  <FormSpacer />
                  <Hr />
                  <ControlledCheckbox
                    name={"isFeatured" as keyof CollectionDetailsPageFormData}
                    label={intl.formatMessage({
                      defaultMessage: "Feature on Homepage",
                      description: "switch button"
                    })}
                    checked={data.isFeatured}
                    onChange={change}
                    disabled={disabled}
                  />
                </VisibilityCard>
              </div>
            </div>
          </Grid>
          <SaveButtonBar
            state={saveButtonBarState}
            disabled={disabled || !hasChanged}
            onCancel={onBack}
            onDelete={onCollectionRemove}
            onSave={submit}
          />
        </Container>
      )}
    </Form>
  );
};
CollectionDetailsPage.displayName = "CollectionDetailsPage";
export default CollectionDetailsPage;