import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useWebinarStore } from "@/store/useWebinarStore";
import { CtaTypeEnum } from "@prisma/client";
import { Search, X } from "lucide-react";
import React, { useState } from "react";
import Stripe from "stripe";

type Props = {
  stripeProducts: Stripe.Product[] | [];
};

const CTAStep = ({ stripeProducts }: Props) => {
  const {
    formData,
    updateCtaField,
    addTag,
    removeTag,
    getStepValidationErrors,
    showErrors,
  } = useWebinarStore();

  const errors = getStepValidationErrors("cta");
  const [tagInput, setTagInput] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateCtaField(name as keyof typeof formData.cta, value);
  };

  const { ctaLabel, tags, aiAgent, priceId, ctaType } = formData.cta;

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      addTag(tagInput.trim());
      setTagInput("");
    }
  };

  const handleSelectCTAType = (value: string) => {
    updateCtaField("ctaType", value as CtaTypeEnum);
  };

  const handleProductChange = (value: string) => {
    updateCtaField("priceId", value);
  };
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label
          htmlFor="ctaLabel"
          className={showErrors.cta && errors.ctaLabel ? "text-red-400" : ""}
        >
          CTA Label <span className="text-red-400">*</span>
        </Label>
        <Input
          id="ctaLabel"
          name="ctaLabel"
          value={ctaLabel || ""}
          onChange={handleChange}
          placeholder="Let's Get Started"
          className={cn(
            "!bg-background/50 border border-input",
            showErrors.cta &&
              errors.ctaLabel &&
              "border-red-400 focus-visible:ring-red-400"
          )}
        />
        {showErrors.cta && errors.ctaLabel && (
          <p className="text-sm text-red-400">{errors.ctaLabel}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <Input
          id="tags"
          value={tagInput}
          name="tags"
          onChange={(e) => setTagInput(e.target.value)}
          placeholder="Add tags and press Enter"
          className="!bg-background/50 border border-input"
          onKeyDown={handleAddTag}
        />
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag: string, index: number) => (
              <div
                className="flex items-center gap-1 bg-gray-800 text-white px-3 py-1 rounded-md"
                key={tag}
              >
                {tag}
                <button
                  className="text-gray-400 hover:text-white"
                  onClick={() => removeTag(tag)}
                >
                  <X className="h-4 w-4 cursor-pointer" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2 w-full">
        <Label>CTA Type</Label>
        <Tabs defaultValue={CtaTypeEnum.BOOK_A_CALL} className="w-full">
          <TabsList className="w-full bg-transparent grid grid-cols-2 gap-2">
            <TabsTrigger
              value={CtaTypeEnum.BOOK_A_CALL}
              className="w-full data-[state=active]:bg-background/50"
              onClick={() => handleSelectCTAType(CtaTypeEnum.BOOK_A_CALL)}
            >
              Book a Call
            </TabsTrigger>
            <TabsTrigger
              value={CtaTypeEnum.BUY_NOW}
              className="w-full"
              onClick={() => handleSelectCTAType(CtaTypeEnum.BUY_NOW)}
            >
              Buy Now
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      {/* Stripe Products */}

      <div className="space-y-2">
        <Label>Attach a Product</Label>
        <div className="relative">
          <div className="mb-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search Agents"
                className="pl-9 !bg-background/50 border border-input"
              />
            </div>
          </div>
          <Select value={priceId} onValueChange={handleProductChange}>
            <SelectTrigger className="w-full !bg-background/50 border border-input">
              <SelectValue placeholder="Select a Product" />
            </SelectTrigger>
            <SelectContent className="bg-background border border-input max-h-48">
              {stripeProducts?.length > 0 ? (
                stripeProducts.map((product) => (
                  <SelectItem
                    key={product.id}
                    value={product?.default_price?.toString() || ""}
                    className="bg-background/50 hover:bg-white/10"
                  >
                    {product.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="" disabled>
                  Create Products in Stripe
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default CTAStep;
