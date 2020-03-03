import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import { Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import makeStyles from "@material-ui/styles/makeStyles";
import classNames from "classnames";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import CardTitle from "@Kaavish/components/CardTitle";
import Grid from "@Kaavish/components/Grid";
import Hr from "@Kaavish/components/Hr";
import MultiAutocompleteSelectField, {
  MultiAutocompleteChoiceType
} from "@Kaavish/components/MultiAutocompleteSelectField";
import SingleAutocompleteSelectField, {
  SingleAutocompleteChoiceType
} from "@Kaavish/components/SingleAutocompleteSelectField";
import { FormsetAtomicData, FormsetChange } from "@Kaavish/hooks/useFormset";
import { maybe } from "@Kaavish/misc";
import { ProductDetails_product_attributes_attribute_values } from "@Kaavish/products/types/ProductDetails";
import { AttributeInputTypeEnum } from "@Kaavish/types/globalTypes";

export interface ProductAttributeInputData {
  inputType: AttributeInputTypeEnum;
  isRequired: boolean;
  values: ProductDetails_product_attributes_attribute_values[];
}
export type ProductAttributeInput = FormsetAtomicData<
  ProductAttributeInputData,
  string[]
>;
export interface ProductAttributesProps {
  attributes: ProductAttributeInput[];
  disabled: boolean;
  onChange: FormsetChange;
  onMultiChange: FormsetChange;
}

const useStyles = makeStyles((theme: Theme) => ({
  attributeSection: {
    "&:last-of-type": {
      paddingBottom: 0
    },
    padding: `${theme.spacing.unit * 2}px 0`
  },
  attributeSectionLabel: {
    alignItems: "center",
    display: "flex"
  },
  card: {
    overflow: "visible"
  },
  cardContent: {
    "&:last-child": {
      paddingBottom: theme.spacing.unit
    },
    paddingTop: theme.spacing.unit
  },
  expansionBar: {
    display: "flex"
  },
  expansionBarButton: {
    marginBottom: theme.spacing.unit
  },
  expansionBarButtonIcon: {
    transition: theme.transitions.duration.short + "ms"
  },
  expansionBarLabel: {
    color: theme.palette.text.disabled,
    fontSize: 14
  },
  expansionBarLabelContainer: {
    alignItems: "center",
    display: "flex",
    flex: 1
  },
  rotate: {
    transform: "rotate(180deg)"
  }
}));

function getMultiChoices(
  values: ProductDetails_product_attributes_attribute_values[]
): MultiAutocompleteChoiceType[] {
  return values.map(value => ({
    label: value.name,
    value: value.slug
  }));
}

function getMultiDisplayValue(
  attribute: ProductAttributeInput
): MultiAutocompleteChoiceType[] {
  return attribute.value.map(attributeValue => {
    const definedAttributeValue = attribute.data.values.find(
      definedValue => definedValue.slug === attributeValue
    );
    if (!!definedAttributeValue) {
      return {
        label: definedAttributeValue.name,
        value: definedAttributeValue.slug
      };
    }

    return {
      label: attributeValue,
      value: attributeValue
    };
  });
}

function getSingleChoices(
  values: ProductDetails_product_attributes_attribute_values[]
): SingleAutocompleteChoiceType[] {
  return values.map(value => ({
    label: value.name,
    value: value.slug
  }));
}

const ProductAttributes: React.FC<ProductAttributesProps> = ({
  attributes,
  disabled,
  onChange,
  onMultiChange
}) => {
  const intl = useIntl();
  const classes = useStyles({});
  const [expanded, setExpansionStatus] = React.useState(true);
  const toggleExpansion = () => setExpansionStatus(!expanded);

  return (
    <Card className={classes.card}>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Attributes",
          description: "product attributes, section header"
        })}
      />
      <CardContent className={classes.cardContent}>
        <div className={classes.expansionBar}>
          <div className={classes.expansionBarLabelContainer}>
            <Typography className={classes.expansionBarLabel} variant="caption">
              <FormattedMessage
                defaultMessage="{number} Attributes"
                description="number of product attributes"
                values={{
                  number: attributes.length
                }}
              />
            </Typography>
          </div>
          <IconButton
            className={classes.expansionBarButton}
            onClick={toggleExpansion}
            data-tc="product-attributes-expand"
          >
            <ArrowDropDownIcon
              className={classNames(classes.expansionBarButtonIcon, {
                [classes.rotate]: expanded
              })}
            />
          </IconButton>
        </div>
        {expanded && attributes.length > 0 && (
          <>
            <Hr />
            {attributes.map((attribute, attributeIndex) => (
              <React.Fragment key={attribute.id}>
                {attributeIndex > 0 && <Hr />}
                <Grid className={classes.attributeSection} variant="uniform">
                  <div
                    className={classes.attributeSectionLabel}
                    data-tc="product-attribute-label"
                  >
                    <Typography>{attribute.label}</Typography>
                  </div>
                  <div data-tc="product-attribute-value">
                    {attribute.data.inputType ===
                    AttributeInputTypeEnum.DROPDOWN ? (
                      <SingleAutocompleteSelectField
                        choices={getSingleChoices(attribute.data.values)}
                        disabled={disabled}
                        displayValue={maybe(
                          () =>
                            attribute.data.values.find(
                              value => value.slug === attribute.value[0]
                            ).name,
                          attribute.value[0]
                        )}
                        emptyOption
                        name={`attribute:${attribute.label}`}
                        label={intl.formatMessage({
                          defaultMessage: "Value",
                          description: "attribute value"
                        })}
                        value={attribute.value[0]}
                        onChange={event =>
                          onChange(attribute.id, event.target.value)
                        }
                        allowCustomValues={!attribute.data.isRequired}
                      />
                    ) : (
                      <MultiAutocompleteSelectField
                        choices={getMultiChoices(attribute.data.values)}
                        displayValues={getMultiDisplayValue(attribute)}
                        label={intl.formatMessage({
                          defaultMessage: "Values",
                          description: "attribute values"
                        })}
                        name={`attribute:${attribute.label}`}
                        value={attribute.value}
                        onChange={event =>
                          onMultiChange(attribute.id, event.target.value)
                        }
                        allowCustomValues={!attribute.data.isRequired}
                      />
                    )}
                  </div>
                </Grid>
              </React.Fragment>
            ))}
          </>
        )}
      </CardContent>
    </Card>
  );
};
ProductAttributes.displayName = "ProductAttributes";
export default ProductAttributes;