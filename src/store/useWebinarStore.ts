import {
  validateAdditionalInfo,
  validateBasicInfo,
  validateCTA,
  ValidationErrors,
} from "@/lib/type";
import { CtaTypeEnum } from "@prisma/client";
import { create } from "zustand";

export type WebinarFormState = {
  basicInfo: {
    webinarName?: string;
    description?: string;
    date?: Date;
    time?: string;
    timeFormat?: "AM" | "PM";
  };
  cta: {
    ctaLabel?: string;
    tags?: string[];
    ctaType: CtaTypeEnum;
    aiAgent?: string;
    priceId?: string;
  };
  additionalInfo: {
    lockChat?: boolean;
    couponCode?: string;
    couponEnabled?: boolean;
  };
};

type ValidationState = {
  basicInfo: {
    valid: boolean;
    errors: ValidationErrors;
  };
  cta: {
    valid: boolean;
    errors: ValidationErrors;
  };
  additionalInfo: {
    valid: boolean;
    errors: ValidationErrors;
  };
};

type ShowErrorsState = {
  basicInfo: boolean;
  cta: boolean;
  additionalInfo: boolean;
};

type WebinarStore = {
  isModalOpen: boolean;
  isComplete: boolean;
  isSubmitting: boolean;
  formData: WebinarFormState;
  validation: ValidationState;
  showErrors: ShowErrorsState;

  setIsModalOpen: (value: boolean) => void;
  setIsComplete: (value: boolean) => void;
  setIsSubmitting: (value: boolean) => void;
  setShowErrorsForStep: (stepId: keyof WebinarFormState, show: boolean) => void;
  updateBasicInfoField: <K extends keyof WebinarFormState["basicInfo"]>(
    field: K,
    value: WebinarFormState["basicInfo"][K]
  ) => void;

  updateCtaField: <K extends keyof WebinarFormState["cta"]>(
    field: K,
    value: WebinarFormState["cta"][K]
  ) => void;

  updateAdditionalInfoField: <
    K extends keyof WebinarFormState["additionalInfo"]
  >(
    field: K,
    value: WebinarFormState["additionalInfo"][K]
  ) => void;

  validateStep: (stepId: keyof WebinarFormState) => boolean;

  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;

  getStepValidationErrors: (stepId: keyof WebinarFormState) => ValidationErrors;

  resetForm: () => void;
};

const initialState: WebinarFormState = {
  basicInfo: {
    webinarName: "",
    description: "",
    date: undefined,
    time: "",
    timeFormat: "AM",
  },
  cta: {
    ctaLabel: "",
    tags: [],
    ctaType: "BOOK_A_CALL",
    aiAgent: "",
    priceId: "",
  },
  additionalInfo: {
    lockChat: false,
    couponCode: "",
    couponEnabled: false,
  },
};

const initialValidation: ValidationState = {
  basicInfo: { valid: false, errors: {} },
  cta: { valid: false, errors: {} },
  additionalInfo: { valid: false, errors: {} },
};

const initialShowErrors: ShowErrorsState = {
  basicInfo: false,
  cta: false,
  additionalInfo: false,
};

export const useWebinarStore = create<WebinarStore>((set, get) => ({
  isModalOpen: false,
  isComplete: false,
  isSubmitting: false,
  formData: initialState,
  validation: initialValidation,
  showErrors: initialShowErrors,

  setIsModalOpen: (open: boolean) => set({ isModalOpen: open }),
  setIsComplete: (complete: boolean) => set({ isComplete: complete }),
  setIsSubmitting: (submitting: boolean) => set({ isSubmitting: submitting }),
  setShowErrorsForStep: (stepId, show) =>
    set((state) => ({ showErrors: { ...state.showErrors, [stepId]: show } })),

  updateBasicInfoField: (field, value) => {
    set((state) => {
      const newBasicInfo = { ...state.formData.basicInfo, [field]: value };

      const validationResult = validateBasicInfo(newBasicInfo);

      return {
        formData: { ...state.formData, basicInfo: newBasicInfo },
        validation: { ...state.validation, basicInfo: validationResult },
      };
    });
  },

  updateCtaField: (field, value) => {
    set((state) => {
      const newCTA = { ...state.formData.cta, [field]: value };

      const validationResult = validateCTA(newCTA);

      return {
        formData: { ...state.formData, cta: newCTA },
        validation: { ...state.validation, cta: validationResult },
      };
    });
  },

  updateAdditionalInfoField: (field, value) => {
    set((state) => {
      const newAdditionalInfo = {
        ...state.formData.additionalInfo,
        [field]: value,
      };

      const validationResult = validateAdditionalInfo(newAdditionalInfo);

      return {
        formData: {
          ...state.formData,
          additionalInfo: newAdditionalInfo,
        },
        validation: { ...state.validation, additionalInfo: validationResult },
      };
    });
  },

  validateStep: (stepId: keyof WebinarFormState) => {
    const { formData } = get();
    let validationResult;

    switch (stepId) {
      case "basicInfo":
        validationResult = validateBasicInfo(formData.basicInfo);
        break;
      case "cta":
        validationResult = validateCTA(formData.cta);
        break;
      case "additionalInfo":
        validationResult = validateAdditionalInfo(formData.additionalInfo);
        break;
    }

    set((state) => ({
      validation: { ...state.validation, [stepId]: validationResult },
      showErrors: { ...state.showErrors, [stepId]: !validationResult.valid },
    }));
    return validationResult.valid;
  },

  getStepValidationErrors: (stepId: keyof WebinarFormState) => {
    return get().validation[stepId].errors;
  },

  resetForm: () =>
    set({
      isComplete: false,
      isSubmitting: false,
      formData: initialState,
      validation: initialValidation,
      showErrors: initialShowErrors,
    }),

  addTag: (tag: string) => {
    set((state) => {
      const newTags = [...(state.formData.cta.tags || []), tag];
      const newCTA = { ...state.formData.cta, tags: newTags };

      return {
        formData: {
          ...state.formData,
          cta: newCTA,
        },
      };
    });
  },

  removeTag: (tagToRemove: string) => {
    set((state) => {
      const newTags = (state.formData.cta.tags || []).filter(
        (tag) => tag !== tagToRemove
      );

      const newCTA = { ...state.formData.cta, tags: newTags };

      return {
        formData: {
          ...state.formData,
          cta: newCTA,
        },
      };
    });
  },
}));
