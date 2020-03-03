import { ContentState, convertToRaw, RawDraftContentState } from "draft-js";
import React from "react";
import { useIntl } from "react-intl";

import AppHeader from "@Kaavish/components/AppHeader";
import { CardSpacer } from "@Kaavish/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@Kaavish/components/ConfirmButton";
import Container from "@Kaavish/components/Container";
import Form from "@Kaavish/components/Form";
import PageHeader from "@Kaavish/components/PageHeader";
import SaveButtonBar from "@Kaavish/components/SaveButtonBar";
import SeoForm from "@Kaavish/components/SeoForm";
import { sectionNames } from "@Kaavish/intl";
import { UserError } from "../../../types";
import CategoryDetailsForm from "../../components/CategoryDetailsForm";

interface FormData {
  description: RawDraftContentState;
  name: string;
  seoTitle: string;
  seoDescription: string;
}

const initialData: FormData = {
  description: convertToRaw(ContentState.createFromText("")),
  name: "",
  seoDescription: "",
  seoTitle: ""
};

export interface CategoryCreatePageProps {
  errors: UserError[];
  disabled: boolean;
  saveButtonBarState: ConfirmButtonTransitionState;
  onSubmit(data: FormData);
  onBack();
}

export const CategoryCreatePage: React.StatelessComponent<
  CategoryCreatePageProps
> = ({
  disabled,
  onSubmit,
  onBack,
  errors: userErrors,
  saveButtonBarState
}) => {
  const intl = useIntl();
  return (
    <Form
      onSubmit={onSubmit}
      initial={initialData}
      errors={userErrors}
      confirmLeave
    >
      {({ data, change, errors, submit, hasChanged }) => (
        <Container>
          <AppHeader onBack={onBack}>
            {intl.formatMessage(sectionNames.categories)}
          </AppHeader>
          <PageHeader
            title={intl.formatMessage({
              defaultMessage: "Create New Category",
              description: "page header"
            })}
          />
          <div>
            <CategoryDetailsForm
              disabled={disabled}
              data={data}
              onChange={change}
              errors={errors}
            />
            <CardSpacer />
            <SeoForm
              helperText={intl.formatMessage({
                defaultMessage:
                  "Add search engine title and description to make this category easier to find"
              })}
              title={data.seoTitle}
              titlePlaceholder={data.name}
              description={data.seoDescription}
              descriptionPlaceholder={data.name}
              loading={disabled}
              onChange={change}
              disabled={disabled}
            />
            <SaveButtonBar
              onCancel={onBack}
              onSave={submit}
              state={saveButtonBarState}
              disabled={disabled || !hasChanged}
            />
          </div>
        </Container>
      )}
    </Form>
  );
};
CategoryCreatePage.displayName = "CategoryCreatePage";
export default CategoryCreatePage;