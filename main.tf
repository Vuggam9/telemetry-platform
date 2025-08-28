terraform {
  required_version = ">= 1.6.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  # backend "s3" {}
}

provider "aws" {
  region = var.region
}

variable "region" { default = "us-east-1" }

# Minimal placeholder: create an EKS cluster using a module or add your own here.
# For brevity, we leave this as a TODO so you can wire your own company-standard module.
# module "eks" { ... }
